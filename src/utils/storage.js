import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Fungsi untuk membuat storage dinamis berdasarkan jenis unggahan
const dynamicStorage = (uploadType) => {
  return multer.diskStorage({
    destination: async (req, file, callback) => {
      let uploadDir;

      // Tentukan direktori penyimpanan berdasarkan jenis unggahan
      if (uploadType === "dokumen") {
        uploadDir = path.join(process.cwd(), "/storage/dokumen");
      } else if (uploadType === "sertifikat") {
        uploadDir = path.join(process.cwd(), "/storage/sertifikat");
      } else {
        // Jika jenis unggahan tidak valid, lemparkan error
        throw new Error("Jenis unggahan tidak valid!");
      }

      // Coba akses direktori, jika tidak ada, buat direktori baru
      try {
        await fs.access(uploadDir);
      } catch (err) {
        await fs.mkdir(uploadDir);
      }

      // Panggil kembali dengan null (tanpa error) dan direktori tujuan
      callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
      // Generate nama file dengan timestamp dan ekstensi asli
      const fileName = Date.now() + path.extname(file.originalname);
      callback(null, fileName);
    },
  });
};

// Fungsi untuk menyaring jenis file berdasarkan jenis unggahan
const fileFilter = (uploadType) => (req, file, callback) => {
  const allowedTypes = {
    dokumen: "application/pdf",
    sertifikat: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ],
  };

  const allowedMimeTypes = allowedTypes[uploadType];

  if (allowedMimeTypes && allowedMimeTypes.includes(file.mimetype)) {
    // Izinkan unggahan untuk tipe MIME yang diizinkan sesuai dengan jenis unggahan
    callback(null, true);
  } else {
    // Kembalikan error untuk file yang tidak sesuai dengan tipe MIME yang diizinkan
    const allowedTypeNames = allowedMimeTypes
      ? allowedMimeTypes.map((type) => type.split("/")[1]).join(" or ")
      : "";

    const err = new Error(
      `Hanya format ${
        uploadType === "dokumen" ? "PDF" : allowedTypeNames
      } yang bisa diunggah!`
    );
    callback(err, false);
  }
};

// Fungsi middleware untuk menangani unggahan berdasarkan jenis
const uploadMiddleware = (uploadType) => {
  return multer({
    storage: dynamicStorage(uploadType),
    fileFilter: fileFilter(uploadType),
    onError: (err) => {
      // Lemparkan error jika terjadi kesalahan selama unggahan
      throw err;
    },
  });
};

// Eksport objek middleware untuk jenis dokument dan sertifikat
export default {
  document: uploadMiddleware("dokumen"),
  certificate: uploadMiddleware("sertifikat"),
};
