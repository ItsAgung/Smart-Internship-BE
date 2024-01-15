import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
  log: ["query"],
});

async function connectToDatabase() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("Koneksi ke database MySQL berhasil.");
  } catch (error) {
    console.error("Gagal menghubungkan ke database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default prismaClient;
export { connectToDatabase };
