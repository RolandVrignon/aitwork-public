import * as pdfjs from "pdfjs-dist";
import { pdfjsWorker } from "pdfjs-dist/webpack";
import { createWorker } from "tesseract.js";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const extractTextFromPDFWithOCR = async (file, progressCallback = () => {}) => {
  const worker = await createWorker({
    logger: m => console.log(m),
  });

  await worker.loadLanguage('fra');
  await worker.initialize('fra');
  const fileCopy = file.slice(0);

  const pdf = await pdfjs.getDocument({ data: fileCopy }).promise;
  const numPages = pdf.numPages;
  const texts = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    progressCallback(pageNum / numPages);
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");

    if (pageText.trim() === "") {
      console.log("Running OCR on page " + pageNum + "...");

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      const { data: { text } } = await worker.recognize(canvas);

      texts.push({ page: pageNum, text: text });
    } else {
      texts.push({ page: pageNum, text: pageText });
    }
  }

  await worker.terminate();

  return texts;
};

export const extractTextFromPDF = async (file, fileName, progressCallback = () => {}) => {
  try {
    const fileCopy = file.slice(0);
    const pdf = await pdfjs.getDocument({ data: fileCopy }).promise;
    const numPages = pdf.numPages;
    const texts = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      progressCallback(pageNum / numPages);
      texts.push({ page: pageNum, text: pageText + "\n\n################\n\n" });
    }

    return { text: texts, fileName, numPages };
  } catch (error) {
    console.error("Erreur lors de l'extraction du texte avec pdfjs-dist :", error);
    console.log("Utilisation de Tesseract.js pour effectuer une OCR...");

    return extractTextFromPDFWithOCR(file);
  }
};

