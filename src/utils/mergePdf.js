import { PDFDocument } from "pdf-lib";
import { join, basename } from "path";
import { promises as fs } from "fs";
import ResponseError from "../error/response-error.js";

async function mergePDFs(path1, path2, outputDir = "/storage/sertifikat") {
  try {
    const fullPath = (path) => join(process.cwd(), outputDir, path);

    const [file1, file2] = await Promise.all([
      fs.readFile(fullPath(path1)),
      fs.readFile(fullPath(path2)),
    ]);

    const pdfDoc = await PDFDocument.create();

    for (const file of [file1, file2]) {
      const pdf = await PDFDocument.load(file);
      const [page] = await pdfDoc.copyPages(pdf, [0]);
      pdfDoc.addPage(page);
    }

    const outputPath = fullPath(`${Date.now()}.pdf`);
    const mergedPDFBytes = await pdfDoc.save();

    await fs.writeFile(outputPath, mergedPDFBytes);
    await fs.unlink(fullPath(path1));

    return basename(outputPath);
  } catch (error) {
    throw new ResponseError(500, "gagal memberikan sertifikat");
  }
}

// contoh penggunaa:
// const file1Path = "pdf1.pdf";
// const file2Path = "pdf2.pdf";

// mergePDFs(file1Path, file2Path)
//   .then((mergedFileName) =>
//     console.log(`PDFs merged successfully: ${mergedFileName}`)
//   )
//   .catch((error) => console.error("Error merging PDFs:", error));

export default mergePDFs;
