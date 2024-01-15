import path from "path";

// Fungsi untuk mendapatkan path dari direktori penyimpanan
const getPathStorage = () => {
  // Menggabungkan path dari direktori kerja saat ini dengan path penyimpanan dokumen
  const pathStorage = path.join(process.cwd(), process.env.STORAGE_DOCUMENT);

  // Menggabungkan path dari direktori kerja saat ini dengan path penyimpanan sertifikat
  const pathCertificate = path.join(
    process.cwd(),
    process.env.STORAGE_CERTIFICATE
  );

  // Mengembalikan array yang berisi path untuk dokumen dan sertifikat
  return [pathStorage, pathCertificate];
};

export default getPathStorage;
