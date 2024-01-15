import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import fs from "fs/promises";
import path from "path";
import validation from "../validation/user.js";
import bcrypt from "bcrypt";

const updateUser = async (request) => {
  const data = validate(validation.updateUser, request.body);

  if (request.file) {
    const imageUrl = `${request.file.filename}`;
    data.surat = imageUrl;
  }

  if (Object.keys(data).length === 0) {
    throw new ResponseError(400, "update gagal, Anda tidak menginputkan nilai");
  }

  if (data.jurusan_id) {
    const checkJurusan = await prisma.jurusan.findUnique({
      where: { id: data.jurusan_id },
    });
    if (!checkJurusan) throw new ResponseError(404, "jurusan tidak ditemukan");
  }

  if (data.instansi_id) {
    const checkInstansi = await prisma.instansi.findUnique({
      where: { id: data.instansi_id },
    });
    if (!checkInstansi)
      throw new ResponseError(404, "instansi tidak ditemukan");
  }

  const check = await prisma.user.findUnique({
    where: { id: request.user.id },
  });

  if (!check) throw new ResponseError(404, "user tidak ditemukan");

  const checkpengajuan = await prisma.pengajuan.findFirst({
    where: {
      AND: [
        { user_id: check.id },
        { is_active: false },
        { status: { not: "ditolak" } },
      ],
    },
  });

  if (checkpengajuan) {
    throw new ResponseError(
      400,
      "tidak bisa update profil jika pengajuan sudah terdata!"
    );
  }

  if (check.surat && data.surat) {
    await fs.unlink(
      path.join(process.cwd(), `storage/dokumen/${check.surat}`),
      () => {}
    );
  }

  const dataPeriod = {
    tanggal_pengajuan: data.tanggal_pengajuan,
    tanggal_selesai: data.tanggal_selesai,
    jenis_pengajuan: data.jenis_pengajuan,
  };

  delete data.tanggal_pengajuan;
  delete data.tanggal_selesai;
  delete data.jenis_pengajuan;

  if (!data.periode_id) {
    dataPeriod.user_id = check.id;
    const updatePeriod = await prisma.periode.create({
      data: dataPeriod,
    });

    delete data.periode_id;
    const updateUser = await prisma.user.update({
      data: data,
      where: { id: request.user.id },
    });

    if (updateUser || updatePeriod) {
      return true;
    } else {
      throw new ResponseError(404, "update user gagal");
    }
  }

  const checkPeriod = await prisma.periode.findFirst({
    where: { AND: [{ id: data.periode_id }, { is_active: false }] },
  });

  delete data.periode_id;
  const updateUser = await prisma.user.update({
    data: data,
    where: { id: request.user.id },
  });

  let updatePeriod;
  if (checkPeriod) {
    updatePeriod = await prisma.periode.update({
      data: dataPeriod,
      where: { id: checkPeriod.id },
    });
  } else {
    dataPeriod.user_id = check.id;
    if (
      dataPeriod.tanggal_pengajuan &&
      dataPeriod.tanggal_selesai &&
      dataPeriod.jenis_pengajuan
    ) {
      updatePeriod = await prisma.periode.create({
        data: dataPeriod,
      });
    }
  }

  if (updateUser || updatePeriod) {
    return true;
  } else {
    throw new ResponseError(404, "update user gagal");
  }
};

const getAll = async () => {
  const users = await prisma.user.findMany();
  if (!users) throw new ResponseError(500, "data users tidak ada");

  return users;
};

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id user tidak boleh kosong");
  }
  const user = await prisma.user.findFirst({
    where: { id: +id },
    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
      nim: true,
      phone: true,
      religion: true,
      surat: true,
      posisi_id: true,
      jurusan: { select: { id: true, name: true } },
      instansi: { select: { id: true, name: true } },
    },
  });

  if (!user) throw new ResponseError(404, `user dengan id ${id} tidak ada`);

  const periode = await prisma.periode.findFirst({
    where: { AND: [{ user_id: user.id }, { is_active: false }] },
  });

  return { ...user, periode: periode };
};

const deleteById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id user tidak boleh kosong");
  }
  const deleted = await prisma.user.delete({ where: { id: +id } });
  if (!deleted) {
    throw new ResponseError(404, `gagal menghapus user dengan id ${id}`);
  }

  return true;
};

const changePassword = async (request) => {
  const data = validate(validation.changePassword, request.body);

  const checkPassword = await prisma.user.findUnique({
    where: { id: request.user.id },
  });

  const isPasswordValid = await bcrypt.compare(
    data.password,
    checkPassword.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "password yang anda masukkan tidak sesuai!");
  }

  const hashPassword = await bcrypt.hash(data.new_password, 10);

  const updated = await prisma.user.update({
    data: { password: hashPassword },
    where: { id: request.user.id },
  });
  if (!updated) {
    throw new ResponseError(400, "gagal mengubah sandi");
  }

  return "ganti password suksess";
};

export default { updateUser, getAll, getById, deleteById, changePassword };
