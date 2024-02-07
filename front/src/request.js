import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;

let instance = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};


const setAuthorizationHeader = (config, token) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

instance.interceptors.request.use(
  (config) => setAuthorizationHeader(config, config.token),
  (error) => {
    return Promise.reject(error);
  }
);

const Get = async (path, token) => {
  try {
    const response = await instance.get(path, { token });
    return response.data;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
};

const Post = async (path, data, token) => {
  try {
    const response = await instance.post(path, JSON.stringify({ data }), {
      token,
    });
    return response.data;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
};

const PostFile = async (
  path,
  formData,
  fileName,
  limitSize,
  minioTags,
  onProgress,
  token
) => {
  try {
    const file = formData.get("fileField");
    const totalSize = file.size;
    const chunkSize = 10 * 1024 * 1024; // 10 MB
    const totalChunks = Math.ceil(totalSize / chunkSize); // Nombre total de morceaux
    let blobFolder; // Déclaration de la variable blobFolder ici

    let start = 0;
    let end = chunkSize;
    let chunkIndex = 0;

    while (start < totalSize) {
      const chunk = file.slice(start, end);
      const chunkFormData = new FormData();
      chunkFormData.append("fileField", chunk);
      chunkFormData.append("chunkIndex", chunkIndex);
      chunkFormData.append("isLastChunk", end >= totalSize);

      const config = {
        token,
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8",
          "limit-size": limitSize,
          size: totalSize,
          "file-name": fileName,
          "chunk-index": chunkIndex,
          "minio-tags": JSON.stringify(minioTags),
          "is-last-chunk": end >= totalSize,
          "blob-folder": blobFolder,
        },
      };

      console.log("config:", config);

      const response = await instance.post(path, chunkFormData, config);

      // Mettre à jour blobFolder avec la valeur renvoyée par le serveur
      if (response.data && response.data.blobFolder) {
        blobFolder = response.data.blobFolder;
      }

      // Calculer le pourcentage de progression
      const progress = ((chunkIndex + 1) / totalChunks) * 100;
      if (onProgress) {
        onProgress(progress);
      }

      if (response.data && response.data.jobId) {
        while (true) {
          await sleep(2000);
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/public/asyncjob/${response.data.jobId}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          });
          const data = await res.json();
          console.log('data:', data);
          if (data.status === "completed") {
              return (data.result);
          } else {
              console.log("waiting...")
          }
        }
      }

      start = end;
      end = start + chunkSize;
      chunkIndex++;
    }
  } catch (error) {
    console.log("error:", error);
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
};


const Put = async (path, data, token) => {
  try {
    const response = await instance.put(path, JSON.stringify({ data }), {
      token,
    });
    return response.data;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
};

const Delete = async (path, token) => {
  try {
    const response = await instance.delete(path, { token });
    return response.data;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  }
};

const Request = {
  Get,
  Post,
  PostFile,
  Put,
  Delete,
};

export default Request;
