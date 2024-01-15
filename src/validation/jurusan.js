import Joi from "joi";

const createJurusan = Joi.object({
  name: Joi.string().required(),
});

const updateJurusan = Joi.object({
  name: Joi.string(),
});

export { createJurusan, updateJurusan };
