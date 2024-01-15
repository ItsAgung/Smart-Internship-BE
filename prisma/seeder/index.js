import instansiSeeder from "./instansi.js";
import jurusanSeeder from "./jurusan.js";
import posisiSeeder from "./posisi.js";
import userSeeder from "./admin.js";

async function runSeeders() {
  try {
    await instansiSeeder();
    await jurusanSeeder();
    await posisiSeeder();
    await userSeeder();
  } catch (error) {
    throw error;
  } finally {
    console.log("Seeders finished.");
  }
}

runSeeders();
