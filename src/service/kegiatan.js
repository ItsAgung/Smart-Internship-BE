import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import formatDate from "../utils/formatDate.js";

const getAll = async (request) => {
  const is_active = request.query.is_active;

  if (is_active === undefined || is_active === null) {
    throw new ResponseError(400, "Request tidak boleh kosong");
  }

  const data = await prisma.pengajuan.findMany({
    where: {
      user_id: request.user.id,
      is_active: is_active === "true",
    },
    orderBy: {
      id: "desc",
    },
    include: {
      posisi: {
        select: {
          nama: true,
        },
      },
      periode: {
        select: {
          jenis_pengajuan: true,
          tanggal_pengajuan: true,
          tanggal_selesai: true,
        },
      },
      sertifikat: {
        select: {
          location: true,
        },
      },
    },
  });

  return data.map((item) => {
    const commonFields = {
      id: item.id,
      posisi: item.posisi.nama,
      status: item.status,
    };

    if (is_active === "false") {
      return {
        ...commonFields,
        tanggal_wawancara: item.tanggal_wawancara,
        tanggal_tes_kemampuan: item.tanggal_tes_kemampuan,
        link_tes_kemampuan:
          formatDate.isToday(new Date(item.tanggal_tes_kemampuan)) &&
          item.link_tes_kemampuan,
        link_wawancara:
          formatDate.isToday(new Date(item.tanggal_wawancara)) &&
          item.link_wawancara,
        tanggal_ditolak:
          item.status.toUpperCase() == "DITOLAK" ? item.updatedAt : null,
        periode_ditolak:
          item.status.toUpperCase() == "DITOLAK"
            ? `${item.periode.tanggal_pengajuan} - ${item.periode.tanggal_selesai}`
            : null,
      };
    } else {
      return {
        ...commonFields,
        tanggal_pengajuan: item.periode.tanggal_pengajuan,
        tanggal_selesai: item.periode.tanggal_selesai,
        jenis_pengajuan: item.periode.jenis_pengajuan,
        sertifikat: item.sertifikat?.location,
      };
    }
  });
};

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "id kouta tidak boleh kosong");
  }
  const instansi = await prisma.pengajuan.findUnique({ where: { id: +id } });
  if (!instansi)
    throw new ResponseError(404, `instansi dengan id ${id} tidak ada`);

  return instansi;
};

const updateById = async (request, id) => {
  if (!id) {
    throw new ResponseError(400, "id kouta tidak boleh kosong");
  }
  const updated = await prisma.pengajuan.update({
    data: request,
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

  // Hapus Instansi itu sendiri
  const deleted = await prisma.pengajuan.delete({ where: { id: +id } });
  if (!deleted) {
    throw new ResponseError(404, `gagal menghapus instansi dengan id ${id}`);
  }

  return true;
};

export default { getAll, getById, updateById, deleteById };
