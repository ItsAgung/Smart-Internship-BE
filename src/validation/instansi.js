import Joi from "joi";

const createInstansi = Joi.object({
  name: Joi.string().required(),
  kuota: Joi.number().required(),
});

const updateInstansi = Joi.object({
  name: Joi.string(),
  kuota: Joi.number().required(),
});

const updateHideInstansi = Joi.object({
  is_active: Joi.boolean().required(),
});

export { createInstansi, updateInstansi, updateHideInstansi };
