import Joi from "joi";

const createPosisi = Joi.object({
  nama: Joi.string().required(),
  kuota: Joi.number().required(),
  prasyarat: Joi.object().required(),
});

const updatePosisi = Joi.object({
  nama: Joi.string(),
  kuota: Joi.number(),
  prasyarat: Joi.object(),
});

const updateHidePosisi = Joi.object({
  is_active: Joi.boolean().required(),
});

export { createPosisi, updatePosisi, updateHidePosisi };
