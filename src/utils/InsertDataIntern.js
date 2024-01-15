import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const {
  DATABASE_INTERN_HOST,
  DATABASE_INTERN_USER,
  DATABASE_INTERN_PASSWORD,
  DATABASE_INTERN_DATABASE,
} = process.env;

const db = mysql.createPool({
  host: DATABASE_INTERN_HOST,
  user: DATABASE_INTERN_USER,
  password: DATABASE_INTERN_PASSWORD,
  database: DATABASE_INTERN_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const insertData = async (data) => {
  try {
    const [rows, fields] = await db.execute(
      "INSERT INTO pegawai (divisi_id, jabatan_id, cabang_id, kelompok_id, pegawai_nama, pegawai_jenis_kelamin, pegawai_agama, pegawai_no_hp,pegawai_tanggal_masuk, pegawai_tanggal_keluar, pegawai_username, pegawai_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        1,
        3,
        1,
        1,
        data.name,
        data.gender,
        data.religion,
        data.phone,
        new Date(data.startDate),
        new Date(data.endDate),
        data.username,
        "CDpvFhauBhcJteFraWzi51E7fV6F/hZQ+nT4/PhxQFs=",
      ]
    );
    console.log("Data berhasil dimasukkan");
    return rows;
  } catch (error) {
    console.error("Error inserting data:", error.message);
  }
};

const main = async (data) => {
  try {
    if (!data) {
      throw new Error("Invalid data is required.");
    }

    await insertData(data);

    console.log("Script selesai dijalankan");
  } catch (error) {
    console.error("Error in main script:", error.message);
  } finally {
    try {
      // Tutup koneksi setelah selesai
      await db.end();
    } catch (error) {
      console.error("Error closing database connection:", error.message);
    }
  }
};

export default main;
