import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createPosisi,
  updatePosisi,
  updateHidePosisi,
} from "../validation/posisi.js";

const create = async (req) => {
  const data = validate(createPosisi, req);

  const countPosisi = await prisma.posisi.count({
    where: {
      nama: data.nama,
    },
  });

  if (countPosisi === 1) {
    throw new ResponseError(400, "posisi sudah terdata!");
  }

  data.is_active = true;
  data.kuota_tersedia = data.kuota;
  return prisma.posisi.create({ data });
};

const getAll = async (request) => {
  if (request) {
    const user = await prisma.user.findUnique({
      where: { id: +request },
      include: {
        instansi: { select: { name: true, is_active: true } },
        periode: { select: { tanggal_pengajuan: true } },
      },
    });

    if (!user) {
      throw new ResponseError(404, "data tidak ditemukan");
    }

    if (!user.instansi || !user.periode) {
      throw new ResponseError(
        400,
        "anda harus melengkapi profile terlebih dahulu"
      );
    }

    const [kouta_active] = await prisma.$transaction(async (prisma) => {
      const kouta_active = await prisma.pengajuan.findMany({
        where: {
          AND: [
            { is_active: true },
            { status: { not: "alumni" } },
            { user: { instansi: { name: user.instansi.name } } },
            {
              periode: {
                tanggal_selesai: { gt: user.periode.tanggal_pengajuan },
              },
            },
          ],
        },
        distinct: ["user_id"],
      });

      const kouta_instansi = await prisma.instansi.findFirst({
        where: { AND: [{ id: user.instansi_id }, { is_active: true }] },
      });

      return [kouta_instansi?.kuota - kouta_active.length];
    });

    if (!kouta_active) {
      throw new ResponseError(400, "kuota instansi anda penuh");
    }

    const posisi = await prisma.posisi.findMany({
      select: { id: true, nama: true, kuota_tersedia: true, prasyarat: true },
      where: { AND: [{ is_active: true }, { kuota: { gt: 0 } }] },
      orderBy: {
        nama: "asc",
      },
    });

    if (!posisi) {
      throw new ResponseError(500, "Data posisi tidak ada");
    }

    return posisi;
  }

  const data = await prisma.posisi.findMany({
    select: { id: true, nama: true, prasyarat: true },
    where: { is_active: true },
    orderBy: {
      nama: "asc",
    },
  });
  if (!data) {
    throw new ResponseError(500, "Data posisi tidak ada");
  }

  return data;
};

const getAllAdmin = async (req) => {
  const { search } = req.query;

  if (!search) {
    const posisi = await prisma.posisi.findMany({
      select: {
        id: true,
        nama: true,
        kuota: true,
        kuota_tersedia: true,
        prasyarat: true,
        sertifikat: true,
        is_active: true,
      },
      orderBy: {
        nama: "asc",
      },
    });
    if (!posisi) throw new ResponseError(500, "data posisi tidak ada");

    return posisi;
  }

  const posisi = await prisma.posisi.findMany({
    where: { nama: { contains: search } },
    select: {
      id: true,
      nama: true,
      kuota: true,
      kuota_tersedia: true,
      prasyarat: true,
    },
    orderBy: {
      nama: "asc",
    },
  });
  if (!posisi) throw new ResponseError(500, "data posisi tidak ada");

  return posisi;
};

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id kouta tidak boleh kosong");
  }
  const posisi = await prisma.posisi.findUnique({
    where: { id: +id },
    select: {
      id: true,
      nama: true,
      kuota: true,
      kuota_tersedia: true,
      prasyarat: true,
      is_active: true,
    },
  });
  if (!posisi) throw new ResponseError(404, `posisi dengan id ${id} tidak ada`);

  return posisi;
};

const hidePosisi = async (req, id) => {
  if (!id) {
    throw new ResponseError(400, "id posisi tidak boleh kosong");
  }
  const posisi = await prisma.posisi.findUnique({ where: { id: +id } });
  if (!posisi) {
    throw new ResponseError(404, `posisi dengan id ${id} tidak ada`);
  }

  const data = validate(updateHidePosisi, req);

  const updated = await prisma.posisi.update({
    data: {
      is_active: data.is_active,
    },
    where: { id: +id },
  });

  if (!updated) {
    throw new ResponseError(404, `gagal mengupdate posisi dengan id ${id}`);
  }

  return "Sukses mengupdate posisi";
};

const updateById = async (request, id) => {
  if (!id) {
    throw new ResponseError(400, "id kouta tidak boleh kosong");
  }

  const data = validate(updatePosisi, request);

  const countPosisi = await prisma.posisi.findFirst({ where: { id: +id } });

  if (!countPosisi) {
    throw new ResponseError(404, `posisi dengan id ${id} tidak ada`);
  }

  const kuota_tersedia = data.kuota - countPosisi.kuota;

  const updated = await prisma.posisi.update({
    data: {
      nama: data.nama,
      kuota: data.kuota,
      kuota_tersedia: { increment: kuota_tersedia },
      prasyarat: data.prasyarat,
    },
    where: { id: +id },
  });
  if (!updated) {
    throw new ResponseError(404, `gagal mengupdate posisi dengan id ${id}`);
  }

  return true;
};

const deleteById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id kouta tidak boleh kosong");
  }

  const deleted = await prisma.posisi.delete({ where: { id: +id } });
  if (!deleted) {
    throw new ResponseError(404, `gagal menghapus posisi dengan id ${id}`);
  }

  return true;
};

export default {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
  getAllAdmin,
  hidePosisi,
};
