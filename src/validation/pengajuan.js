import Joi from "joi";

const createPengajuan = Joi.object({
  user_id: Joi.number().required(),
  posisi: Joi.string().required(),
});

export { createPengajuan };
