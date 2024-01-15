import prisma from "../../src/application/database.js";
import jurusan from "../data/jurusan.json" assert { type: "json" };

async function main() {
  try {
    await prisma.jurusan.createMany({
      data: jurusan,
    });
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;
