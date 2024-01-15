import express from "express";
import posisi from "../controller/posisi.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/posisi", posisi.getAllPosisi);
router.post(
  "/posisi",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  posisi.createPosisi
);

router.get(
  "/admin/posisi",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  posisi.getAllPosisiAdmin
);

router.put(
  "/posisi/hide/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  posisi.hidePosisi
);

router.get(
  "/posisi/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  posisi.getById
);

router.put(
  "/posisi/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  posisi.updateByid
);

router.delete(
  "/posisi/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  posisi.deleteByid
);

export default router;
