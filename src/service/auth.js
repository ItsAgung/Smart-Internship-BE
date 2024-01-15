import { validate } from "../validation/validation.js";
import {
  loginUserValidation,
  registerUserValidation,
  changePasswordValidation,
} from "../validation/auth.js";
import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "../utils/nodemailer.js";
const { JWT_SECRET_KEY } = process.env;

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prisma.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "email sudah terdaftar!");
  }

  let otp = Math.floor(Math.random() * 900000) + 100000;

  user.password = await bcrypt.hash(user.password, 10);
  user.status = "terdaftar";
  user.kode_otp = otp;

  delete user.confirmpassword;

  user.role = "USER";

  const html = await nodemailer.getHtml("email/activation.ejs", {
    user: { name: user.name },
    otp,
  });

  nodemailer.sendMail(user.email, "Aktivasi Akun", html);

  return prisma.user.create({
    data: user,
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prisma.user.findUnique({
    where: {
      email: loginRequest.email,
    },
  });

  if (!user) {
    throw new ResponseError(401, "email atau password anda salah!");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "email atau password anda salah!");
  }

  if (user.role.toLocaleUpperCase() == "ADMIN" && user.activation == false) {
    throw new ResponseError(401, "Akun anda nonaktif");
  }

  if (!user.activation) {
    let otp = Math.floor(Math.random() * 900000) + 100000;

    const check = await prisma.user.update({
      data: { kode_otp: otp },
      where: { id: user.id },
    });

    if (!check) {
      throw new ResponseError(400, "user anda tidak ditemukan");
    }

    const html = await nodemailer.getHtml("email/activation.ejs", {
      user: { name: check.name },
      otp,
    });

    nodemailer.sendMail(check.email, "Aktivasi Akun", html);
    return {
      id: user.id,
      email: user.email,
      message: "aktifasi email anda terlebih dahulu",
    };
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = await jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return token;
};

const activation = async (request) => {
  const { user_id, otp } = request;

  if (!otp) {
    throw new ResponseError(400, "kamu harus menginputkan otp");
  }

  const check = await prisma.user.findUnique({
    where: { id: user_id },
  });

  if (!check) {
    throw new ResponseError(400, "user anda tidak ditemukan");
  }

  if (check.kode_otp != otp) {
    throw new ResponseError(400, "kamu menginputkan kode otp yang salah");
  }

  const updated = await prisma.user.update({
    data: { activation: true },
    where: { id: user_id },
  });

  if (!updated) {
    throw new ResponseError(400, "aktivasi gagal");
  }

  const notifData = {
    title: "Selamat Datang di Smart Internship",
    description: `akun anda telah terdaftar di Smart Intenship`,
  };

  const html = await nodemailer.getHtml("email/notification.ejs", {
    user: {
      name: updated.name,
      subject: notifData.title,
      description: notifData.description,
    },
  });

  nodemailer.sendMail(
    updated.email,
    "Selamat Datang di Smart Internship",
    html
  );

  const payload = {
    id: check.id,
    name: check.name,
    email: check.email,
    role: check.role,
  };

  const token = await jwt.sign(payload, JWT_SECRET_KEY);

  return { message: "aktivasi sukses, akun anda sudah terdaftar", token };
};

const sendOtp = async (request) => {
  const { id } = request;

  let otp = Math.floor(Math.random() * 900000) + 100000;

  const check = await prisma.user.update({
    data: { kode_otp: otp },
    where: { id },
    select: { name: true, email: true },
  });

  if (!check) {
    throw new ResponseError(400, "user anda tidak ditemukan");
  }

  const html = await nodemailer.getHtml("email/activation.ejs", {
    user: { name: check.name },
    otp,
  });

  nodemailer.sendMail(check.email, "Aktivasi Akun", html);

  return "kami mengirimkan kode otp baru ke email anda";
};

const forgotPassword = async (request) => {
  const { email } = request;

  if (!email) {
    throw new ResponseError(400, "kamu harus menginputkan email");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ResponseError(400, "email tidak terdaftar");
  }

  const payload = {
    id: user.id,
  };

  const token = await jwt.sign(payload, JWT_SECRET_KEY);
  const url = `${process.env.FE_URL}/sandibaru?token=${token}`;
  const html = await nodemailer.getHtml("email/resetpassword.ejs", {
    name: user.name,
    url,
  });

  nodemailer.sendMail(user.email, "Reset Password", html);

  return { message: "kami mengirimkan email untuk reset password!", token };
};

const resetPassword = async (request) => {
  const dataRequest = validate(changePasswordValidation, request);

  if (!dataRequest.token) {
    throw new ResponseError(400, "token tidak valid");
  }

  const hashPassword = await bcrypt.hash(dataRequest.new_password, 10);
  const data = await jwt.verify(dataRequest.token, JWT_SECRET_KEY);

  if (!data) throw new ResponseError(400, "token tidak valid");

  const updated = await prisma.user.update({
    data: { password: hashPassword },
    where: { id: data.id },
  });
  if (!updated) {
    throw new ResponseError(400, "gagal mengubah sandi");
  }

  return "reset password suksess";
};

export default {
  register,
  login,
  activation,
  sendOtp,
  forgotPassword,
  resetPassword,
};
