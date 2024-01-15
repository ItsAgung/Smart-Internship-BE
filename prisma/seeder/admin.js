// instansi-seeder.mjs

import prisma from "../../src/application/database.js";
import bcrypt from "bcrypt";
import admin from "../data/admin.json" assert { type: "json" };

async function main() {
  try {
    const hashedAdmin = admin.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10), // hash password menggunakan bcrypt
    }));

    await prisma.user.createMany({
      data: hashedAdmin,
    });
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;
