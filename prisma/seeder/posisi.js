import prisma from "../../src/application/database.js";
import posisi from "../data/posisi.json" assert { type: "json" };

async function main() {
  try {
    await prisma.posisi.createMany({
      data: posisi,
    });
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;
