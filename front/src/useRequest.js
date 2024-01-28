const useRequest = () => {

  const Request = require("./request").default;

  const token = localStorage.getItem('websiteToken');

  const getRequestFunction = (originalFunction) => {
    return async (...args) => {
      return originalFunction(...args, token);
    };
  };

  const RequestObj = {
    Get: getRequestFunction(Request.Get),
    Post: getRequestFunction(Request.Post),
    PostFile: getRequestFunction(Request.PostFile),
    Put: getRequestFunction(Request.Put),
    Delete: getRequestFunction(Request.Delete),
  }

  return RequestObj;
};

export default useRequest;
