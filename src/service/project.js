import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import { createProject, updateProject } from "../validation/project.js";

const create = async (req) => {
  const data = validate(createProject, req.body);

  const checkProject = await prisma.pengajuan.findFirst({
    where: { id: data.pengajuan_id },
    include: {
      sertifikat: true,
    },
  });

  if (checkProject.sertifikat) {
    throw new ResponseError(
      404,
      `project tidak bisa ditambah karena sudah memiliki sertifikat`
    );
  }

  const countProject = await prisma.project.findFirst({
    where: {
      AND: [{ user_id: req.user.id }, { judul: { contains: data.judul } }],
    },
  });

  if (countProject === 1) {
    throw new ResponseError(400, "project sudah terdata!");
  }

  const checkPengajuan = await prisma.pengajuan.count({
    where: {
      AND: [
        { user_id: req.user.id },
        { is_active: true },
        { id: data.pengajuan_id },
      ],
    },
  });

  if (checkPengajuan == 0) {
    throw new ResponseError(400, "anda belom mengajukan project ini");
  }

  return prisma.project.create({ data });
};

const getAll = async (req) => {
  const project = await prisma.project.findMany({
    where: {
      user_id: req.user.id,
      pengajuan_id: +req.query.id,
    },
  });

  if (!project) throw new ResponseError(500, "data project tidak ada");

  return project;
};

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id project tidak boleh kosong");
  }
  const project = await prisma.project.findUnique({
    where: { id: +id },
  });
  if (!project) {
    throw new ResponseError(404, `project dengan id ${id} tidak ada`);
  }

  return project;
};

const updateById = async (request, id) => {
  if (!id) {
    throw new ResponseError(400, "id project tidak boleh kosong");
  }

  const checkProject = await prisma.project.findFirst({
    where: { id: +id },
    include: {
      kegiatan: {
        include: {
          sertifikat: true,
        },
      },
    },
  });

  if (checkProject.kegiatan.sertifikat) {
    throw new ResponseError(
      404,
      `project tidak bisa dirubah karena sudah memiliki sertifikat`
    );
  }

  const data = validate(updateProject, request);

  const countproject = await prisma.project.findFirst({ where: { id: +id } });

  if (!countproject) {
    throw new ResponseError(404, `project dengan id ${id} tidak ada`);
  }

  const updated = await prisma.project.update({
    data,
    where: { id: +id },
  });

  if (!updated) {
    throw new ResponseError(404, `gagal mengupdate project dengan id ${id}`);
  }

  return true;
};

const deleteById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id project tidak boleh kosong");
  }

  const checkProject = await prisma.project.findFirst({
    where: { id: +id },
    include: {
      kegiatan: {
        include: {
          sertifikat: true,
        },
      },
    },
  });

  if (checkProject.kegiatan.sertifikat) {
    throw new ResponseError(
      404,
      `project tidak bisa dirubah karena sudah memiliki sertifikat`
    );
  }

  const deleted = await prisma.project.delete({ where: { id: +id } });
  if (!deleted) {
    throw new ResponseError(404, `gagal menghapus project dengan id ${id}`);
  }

  return true;
};

export default {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
