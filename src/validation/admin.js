import Joi from "joi";

const updateLink = Joi.object({
  status: Joi.string(),
  tanggal: Joi.string(),
  link: Joi.string(),
});

const insertTemplate = Joi.object({
  name: Joi.string().required(),
});

const insertTemplatePosisi = Joi.object({
  id: Joi.number().required(),
});

const createAdmin = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password harus memiliki minimal 8 karakter",
  }),
});

const updateAdmin = Joi.object({
  user_id: Joi.number().required(),
  activation: Joi.boolean().required(),
});

const createSertifikat = Joi.object({
  id: Joi.number().required(),
});

export default {
  updateLink,
  insertTemplate,
  insertTemplatePosisi,
  createAdmin,
  updateAdmin,
  createSertifikat,
};
