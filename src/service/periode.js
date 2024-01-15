import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import { createPeriode, updatePeriode } from "../validation/periode.js";

const create = async (req) => {
  const data = validate(createPeriode, req.body);

  const countPeriode = await prisma.periode.count({
    where: {
      user_id: req.user.id,
    },
  });

  if (countPeriode === 1) {
    throw new ResponseError(400, "periode sudah terdata!");
  }

  return prisma.periode.create({ data });
};

const getAll = async () => {
  const periode = await prisma.periode.findMany();
  if (!periode) throw new ResponseError(500, "data periode tidak ada");

  return periode;
};

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id periode tidak boleh kosong");
  }
  const periode = await prisma.periode.findUnique({ where: { id: +id } });
  if (!periode)
    throw new ResponseError(404, `periode dengan id ${id} tidak ada`);

  return periode;
};

const updateById = async (request, id) => {
  if (!id) {
    throw new ResponseError(400, "id periode tidak boleh kosong");
  }

  const data = validate(updatePeriode, request.body);

  const checkPengajuan = await prisma.pengajuan.findFirst({
    where: { AND: [{ user_id: request.user.id }, { is_active: true }] },
  });

  if (checkPengajuan) {
    throw new ResponseError(
      400,
      "anda sudah mengajukan magang, tidak bisa merubah kembali periode"
    );
  }

  const updated = await prisma.periode.update({
    data: data,
    where: { id: +id },
  });
  if (!updated) {
    throw new ResponseError(404, `gagal mengupdate periode dengan id ${id}`);
  }

  return true;
};

const deleteById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id periode tidak boleh kosong");
  }

  // Hapus semua Kouta yang terkait dengan periode
  await prisma.kuota.deleteMany({
    where: {
      periode_id: +id,
    },
  });

  // Hapus periode itu sendiri
  const deleted = await prisma.periode.delete({ where: { id: +id } });
  if (!deleted) {
    throw new ResponseError(404, `gagal menghapus periode dengan id ${id}`);
  }

  return true;
};

export default { create, getAll, getById, updateById, deleteById };
