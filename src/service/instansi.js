import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createInstansi,
  updateInstansi,
  updateHideInstansi,
} from "../validation/instansi.js";

const create = async (req) => {
  const data = validate(createInstansi, req);

  const countinstansi = await prisma.instansi.count({
    where: {
      name: {
        equals: data.name,
      },
    },
  });

  if (countinstansi === 1) {
    throw new ResponseError(400, "instansi sudah terdata!");
  }

  data.is_active = true;
  data.kuota_tersedia = data.kuota;
  return prisma.instansi.create({ data });
};

const getAll = async (req) => {
  const { search } = req.query;

  if (!search) {
    const instansi = await prisma.instansi.findMany({
      select: {
        id: true,
        name: true,
        kuota: true,
        kuota_tersedia: true,
        is_active: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    if (!instansi) throw new ResponseError(500, "data instansi tidak ada");

    return instansi;
  }

  const instansi = await prisma.instansi.findMany({
    where: {
      name: { contains: search },
      select: { id: true, name: true, kuota: true, kuota_tersedia: true },
    },
  });
  if (!instansi) throw new ResponseError(500, "data instansi tidak ada");

  return instansi;
};

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id instansi tidak boleh kosong");
  }
  const instansi = await prisma.instansi.findUnique({
    where: { id: +id },
    select: {
      id: true,
      name: true,
      kuota: true,
      kuota_tersedia: true,
      is_active: true,
    },
  });
  if (!instansi) {
    throw new ResponseError(404, `instansi dengan id ${id} tidak ada`);
  }

  return instansi;
};

const hideInstansi = async (req, id) => {
  if (!id) {
    throw new ResponseError(400, "id instansi tidak boleh kosong");
  }
  const instansi = await prisma.instansi.findUnique({ where: { id: +id } });
  if (!instansi) {
    throw new ResponseError(404, `instansi dengan id ${id} tidak ada`);
  }

  const data = validate(updateHideInstansi, req);

  const updated = await prisma.instansi.update({
    data: {
      is_active: data.is_active,
    },
    where: { id: +id },
  });

  if (!updated) {
    throw new ResponseError(404, `gagal mengupdate instansi dengan id ${id}`);
  }

  return "Sukses mengupdate instansi";
};

const updateById = async (request, id) => {
  if (!id) {
    throw new ResponseError(400, "id instansi tidak boleh kosong");
  }

  const data = validate(updateInstansi, request);

  const countinstansi = await prisma.instansi.findFirst({ where: { id: +id } });

  if (!countinstansi) {
    throw new ResponseError(404, `instansi dengan id ${id} tidak ada`);
  }

  const kuota_tersedia = data.kuota - countinstansi.kuota;
  const updated = await prisma.instansi.update({
    data: {
      name: data.name,
      kuota: data.kuota,
      kuota_tersedia: { increment: kuota_tersedia },
    },
    where: { id: +id },
  });
  if (!updated) {
    throw new ResponseError(404, `gagal mengupdate instansi dengan id ${id}`);
  }

  return true;
};

const deleteById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id instansi tidak boleh kosong");
  }

  // Hapus semua Kouta yang terkait dengan Instansi
  await prisma.kuota.deleteMany({
    where: {
      instansi_id: +id,
    },
  });

  // Hapus Instansi itu sendiri
  const deleted = await prisma.instansi.delete({ where: { id: +id } });
  if (!deleted) {
    throw new ResponseError(404, `gagal menghapus instansi dengan id ${id}`);
  }

  return true;
};

export default {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
  hideInstansi,
};
