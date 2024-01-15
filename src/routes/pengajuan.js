import express from "express";
import pengajuan from "../controller/pengajuan.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/pengajuan", Middleware.authMiddleware, pengajuan.createPengajuan);
router.get("/pengajuan", Middleware.authMiddleware, pengajuan.getAllPengajuan);
router.get("/pengajuan/:id", Middleware.authMiddleware, pengajuan.getById);
router.delete(
  "/pengajuan/:id",
  Middleware.authMiddleware,
  pengajuan.deleteByid
);

export default router;
