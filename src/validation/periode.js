import Joi from "joi";

const createPeriode = Joi.object({
  user_id: Joi.number().required(),
  tanggal_pengajuan: Joi.string().required(),
  tanggal_selesai: Joi.string().required(),
  jenis_pengajuan: Joi.string().required(),
});

const updatePeriode = Joi.object({
  tanggal_pengajuan: Joi.string(),
  tanggal_selesai: Joi.string(),
  jenis_pengajuan: Joi.string(),
});

export { createPeriode, updatePeriode };
