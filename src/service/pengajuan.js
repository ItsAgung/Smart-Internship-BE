import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import { createPengajuan } from "../validation/pengajuan.js";

const create = async (req) => {
  const data = validate(createPengajuan, req.body);

  const checkPosisi = await prisma.posisi.findFirst({
    where: { nama: { contains: data.posisi } },
  });

  if (!checkPosisi) {
    throw new ResponseError(400, "posisi yang dipilih tidak ditemukan");
  }

  const checkPeriod = await prisma.periode.findFirst({
    where: { AND: [{ user_id: req.user.id }, { is_active: false }] },
  });

  if (!checkPeriod) {
    throw new ResponseError(
      400,
      "anda harus mengisi periode magang terlebih dahulu"
    );
  }

  const checkpengajuan = await prisma.pengajuan.findFirst({
    where: {
      AND: [
        { posisi_id: checkPosisi.id },
        { user_id: data.user_id },
        { status: { not: "ditolak" } },
        { status: { not: "alumni" } },
      ],
    },
  });

  if (checkpengajuan) {
    throw new ResponseError(400, "pengajuan sudah terdata!");
  }

  const user = await prisma.user.findUnique({
    where: { id: data.user_id },
    select: {
      instansi: { select: { name: true } },
      is_active: true,
      periode: { select: { tanggal_pengajuan: true } },
      instansi_id: true,
    },
  });

  if (!user.instansi?.name) {
    throw new ResponseError(
      400,
      "instansi tidak ditemukan silahkan isi data diri dulu"
    );
  }

  if (user.is_active == true) {
    throw new ResponseError(400, "Anda Sudah Aktif Magang!");
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

  data.status = "administrasi";
  delete data.posisi;
  data.posisi_id = checkPosisi.id;
  data.periode_id = checkPeriod.id;
  data.is_active = false;
  data.status_administrasi = "Proses";

  await prisma.$transaction(async (prisma) => {
    await prisma.pengajuan.create({ data });

    await prisma.user.update({
      data: { status: "administrasi" },
      where: { id: data.user_id },
    });
  });

  return "sukses mengajukan lamaran";
};

const getAll = async () => {
  const pengajuan = await prisma.pengajuan.findMany();
  if (!pengajuan) throw new ResponseError(500, "data pengajuan tidak ada");

  return pengajuan;
};

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id kouta tidak boleh kosong");
  }
  const pengajuan = await prisma.pengajuan.findUnique({ where: { id: +id } });
  if (!pengajuan)
    throw new ResponseError(404, `pengajuan dengan id ${id} tidak ada`);

  return pengajuan;
};

const deleteById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id kouta tidak boleh kosong");
  }
  const deleted = await prisma.pengajuan.delete({ where: { id: +id } });
  if (!deleted) {
    throw new ResponseError(404, `gagal menghapus pengajuan dengan id ${id}`);
  }

  return true;
};

export default { create, getAll, getById, deleteById };
