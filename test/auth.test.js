import supertest from "supertest";
import { web } from "../src/application/web.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

beforeAll(async () => {
  await removeTestUser();
});

let value = {};

describe("POST /auth/register", function () {
  it("should can register new user", async () => {
    const result = await supertest(web).post("/auth/register").send({
      name: "ferdie",
      email: "maulanaferdie1@gmail.com",
      password: "ferdie12",
      confirmpassword: "ferdie12",
    });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe(true);
    expect(result.body.message).toBe("register succes");
    expect(result.body.data.name).toBe("ferdie");
    expect(result.body.data.email).toBe("maulanaferdie1@gmail.com");
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/auth/register").send({
      name: "",
      password: "",
      email: "",
      confirmpassword: "",
    });

    console.log(result.body.erros);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already registered", async () => {
    const result = await supertest(web).post("/auth/register").send({
      name: "ferdie",
      email: "maulanaferdie1@gmail.com",
      password: "ferdie12",
      confirmpassword: "ferdie12",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBe("email sudah terdaftar!");
  });
});

describe("POST /auth/activation", function () {
  it("should can't activation account", async () => {
    const data = await getTestUser();
    value.id = data.id;
    value.email = data.email;
    const result = await supertest(web).post("/auth/activation").send({
      user_id: data.id,
      otp: 123456,
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBe("kamu menginputkan kode otp yang salah");
  });
  it("should can activation account", async () => {
    const data = await getTestUser();
    const result = await supertest(web).post("/auth/activation").send({
      user_id: data.id,
      otp: data.kode_otp,
    });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.message).toBe(
      "aktivasi sukses, akun anda sudah terdaftar"
    );
  });
});

describe(`POST /auth/sendotp`, function () {
  it("should can send otp", async () => {
    const result = await supertest(web).post("/auth/sendotp").send({
      id: value.id,
    });

    expect(result.status).toBe(200);
    expect(result.body.message).toBe(
      "kami mengirimkan kode otp baru ke email anda"
    );
  });
});

describe("POST /auth/login", function () {
  it("should can login", async () => {
    const result = await supertest(web).post("/auth/login").send({
      email: "maulanaferdie1@gmail.com",
      password: "ferdie12",
    });

    expect(result.status).toBe(200);
    expect(result.body.message).toBe("login succes");
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  it("should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/auth/login").send({
      email: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject login if password is wrong", async () => {
    const result = await supertest(web).post("/auth/login").send({
      email: "maulanaferdie1@gmail.com",
      password: "salah",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("email atau password anda salah!");
  });
});

describe("POST /auth/forgotpassword", function () {
  it("should can forgot password", async () => {
    const result = await supertest(web).post("/auth/forgotpassword").send({
      email: value.email,
    });

    value.token = result.body.data;

    expect(result.status).toBe(200);
    expect(result.body.message).toBe(
      "kami mengirimkan email untuk reset password!"
    );
  });

  it("should can't forgot password", async () => {
    const result = await supertest(web).post("/auth/forgotpassword").send({
      email: "example@gmail.com",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBe("email tidak terdaftar");
  });
});

describe("POST /auth/resetpassword", function () {
  it("should can reset password", async () => {
    const result = await supertest(web).post("/auth/resetpassword").send({
      new_password: "FerdieKeren",
      confirm_new_password: "FerdieKeren",
      token: value.token,
    });

    console.log(value.token);
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("reset password suksess");
  });

  it("should can't reset password", async () => {
    const result = await supertest(web).post("/auth/resetpassword").send({
      new_password: "FerdieKeren",
      confirm_new_password: "FerdiKeren",
      token: value.token,
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBe(
      "password dan confirm password tidak sesuai"
    );
  });
});
