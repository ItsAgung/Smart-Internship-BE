import prisma from "../../src/application/database.js";
import instansi from "../data/instansi.json" assert { type: "json" };

async function main() {
  try {
    const result = instansi.map((item) => ({
      ...item,
      kuota_tersedia: item.kuota,
      is_active: true,
    }));

    await prisma.instansi.createMany({
      data: result,
      skipDuplicates: true,
    });
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;
