import Joi from "joi";

const updateUser = Joi.object({
  periode_id: Joi.number().required(),
  name: Joi.string().required(),
  nim: Joi.string().required(),
  religion: Joi.string().required(),
  gender: Joi.string().required(),
  phone: Joi.string().required(),
  jurusan_id: Joi.number().required(),
  instansi_id: Joi.number().required(),
  tanggal_pengajuan: Joi.string().required(),
  tanggal_selesai: Joi.string().required(),
  jenis_pengajuan: Joi.string().required(),
});

const changePassword = Joi.object({
  password: Joi.string().required(),
  new_password: Joi.string().min(8).required().messages({
    "string.min": "Password harus memiliki minimal 8 karakter",
  }),
  new_confirmpassword: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Konfirmasi password harus sesuai dengan password",
    }),
});

export default { updateUser, changePassword };
