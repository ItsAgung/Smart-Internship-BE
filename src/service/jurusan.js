import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import { createJurusan, updateJurusan } from "../validation/jurusan.js";

const create = async (req) => {
  const data = validate(createJurusan, req);

  const countjurusan = await prisma.jurusan.count({
    where: {
      name: {
        equals: data.name,
      },
    },
  });

  if (countjurusan === 1) {
    throw new ResponseError(400, "jurusan sudah terdata!");
  }

  return prisma.jurusan.create({ data });
};

const getAll = async (req) => {
  const { search } = req.query;

  if (!search) {
    const jurusan = await prisma.jurusan.findMany({
      orderBy: {
        name: "asc",
      },
    });
    if (!jurusan) throw new ResponseError(500, "data jurusan tidak ada");

    return jurusan;
  }

  const jurusan = await prisma.jurusan.findMany({
    where: { name: { contains: search } },
    orderBy: {
      name: "asc",
    },
  });
  if (!jurusan) throw new ResponseError(500, "data jurusan tidak ada");

  return jurusan;
};

const getAllJurusanInstansi = async () => {
  const [jurusan, instansi] = await prisma.$transaction(async (prisma) => {
    const jurusan = await prisma.jurusan.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    const instansi = await prisma.instansi.findMany({
      select: { id: true, name: true },
      where: { is_active: true },
      orderBy: { name: "asc" },
    });

    return [jurusan, instansi];
  });

  if (!jurusan || !instansi) {
    throw new ResponseError(500, "datanya belum ada ");
  }

  return { jurusan, instansi };
};

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id jurusan tidak boleh kosong");
  }
  const jurusan = await prisma.jurusan.findUnique({ where: { id: +id } });
  if (!jurusan)
    throw new ResponseError(404, `jurusan dengan id ${id} tidak ada`);

  return jurusan;
};

const updateById = async (request, id) => {
  if (!id) {
    throw new ResponseError(400, "id jurusan tidak boleh kosong");
  }

  const data = validate(updateJurusan, request);
  const updated = await prisma.jurusan.update({
    data,
    where: { id: +id },
  });
  if (!updated) {
    throw new ResponseError(404, `gagal mengupdate jurusan dengan id ${id}`);
  }

  return true;
};

const deleteById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id jurusan tidak boleh kosong");
  }

  // Hapus semua Kouta yang terkait dengan jurusan
  await prisma.kuota.deleteMany({
    where: {
      jurusan_id: +id,
    },
  });

  // Hapus jurusan itu sendiri
  const deleted = await prisma.jurusan.delete({ where: { id: +id } });
  if (!deleted) {
    throw new ResponseError(404, `gagal menghapus jurusan dengan id ${id}`);
  }

  return true;
};

export default {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
  getAllJurusanInstansi,
};
