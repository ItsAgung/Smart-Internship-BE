import express from "express";
import jurusan from "../controller/jurusan.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/jurusan_instansi", jurusan.getAllJurusanInstansi);

router.post(
  "/jurusan",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  jurusan.createjurusan
);

router.get(
  "/jurusan",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  jurusan.getAlljurusan
);

router.get(
  "/jurusan/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  jurusan.getById
);

router.put(
  "/jurusan/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  jurusan.updateByid
);

router.delete(
  "/jurusan/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  jurusan.deleteByid
);

export default router;
