import { readFile, writeFile, unlink } from "fs/promises";
import path from "path";
import libre from "libreoffice-convert";
import util from "util";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import formatDate from "./formatDate.js";
import ResponseError from "../error/response-error.js";

libre.convertAsync = util.promisify(libre.convert);

/**
 * Fungsi untuk mengonversi file DOCX ke PDF menggunakan template dan data yang diberikan.
 * @param {string} inputPath - Path file input DOCX.
 * @param {string} outputPath - Path file output PDF.
 * @param {Object} data - Data yang akan di-render pada template.
 */
async function convertDocxToPdf(inputPath, outputPath, data) {
  try {
    // Muat file docx sebagai konten biner
    const content = await readFile(inputPath, "binary");

    // Unzip konten file
    const zip = new PizZip(content);

    // Ini akan mengurai template
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render dokumen
    doc.render({
      name: data.name,
      title: data.title,
      start_date: formatDate.convertDate(data.start_date, "en-US"),
      end_date: formatDate.convertDate(data.end_date, "en-US"),
    });

    // Dapatkan dokumen zip dan hasilkan sebagai nodebuffer
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Tulis file docx yang dimodifikasi ke path output
    await writeFile(outputPath, buf);

    // Konversi ke format pdf dengan filter undefined
    const docxBuf = await readFile(outputPath);
    const pdfBuf = await libre.convertAsync(docxBuf, ".pdf", undefined);

    // Tulis file pdf ke path output
    await writeFile(outputPath.replace(".docx", ".pdf"), pdfBuf);
  } finally {
    // Hapus file docx sementara setelah konversi PDF
    await unlink(outputPath);
  }
}

/**
 * Fungsi untuk mengonversi file DOCX ke PDF dan mengembalikan nama file hasil konversi.
 * @param {string} inputPath - Path file input DOCX.
 * @param {Object} data - Data yang akan di-render pada template.
 * @returns {string} - Nama file hasil konversi PDF.
 */
async function convertFile(inputPath, data) {
  const outputPath = path.join(
    process.cwd(),
    "/storage/sertifikat",
    `${Date.now()}.docx`
  );

  const input = path.join(process.cwd(), "/storage/sertifikat", inputPath);

  try {
    // Convert DOCX ke PDF dan lakukan operasi lainnya
    await convertDocxToPdf(input, outputPath, data);
    return path.basename(outputPath.replace(".docx", ".pdf"));
  } catch (error) {
    throw new ResponseError(500, error.message);
  }
}

// contoh penggunaan :
// const file = await convertFile(
//   path.join(process.cwd(), "/storage/sertifikat/tes.docx"),
//   {
//     name: "Ferdie",
//     title: "Universitas Muhammadiyah Riau",
//   }
// );

export default convertFile;
