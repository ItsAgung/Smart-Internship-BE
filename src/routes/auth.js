import express from "express";
import auth from "../controller/auth.js";

const router = express.Router();

router.post("/auth/register", auth.register);
router.post("/auth/login", auth.login);
router.post("/auth/activation", auth.activation);
router.post("/auth/sendotp", auth.sendOtp);
router.post("/auth/forgotpassword", auth.forgotPassword);
router.post("/auth/resetpassword", auth.resetPassword);

export default router;
