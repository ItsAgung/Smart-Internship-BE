import Joi from "joi";

const createProject = Joi.object({
  user_id: Joi.number().required(),
  pengajuan_id: Joi.number().required(),
  judul: Joi.string().required(),
  persentase: Joi.number().required(),
  keterangan: Joi.string().required(),
});

const updateProject = Joi.object({
  persentase: Joi.number(),
  keterangan: Joi.string(),
});

export { createProject, updateProject };
