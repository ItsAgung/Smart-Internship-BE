import express from "express";
import instansi from "../controller/instansi.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post(
  "/instansi",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  instansi.createInstansi
);

router.get(
  "/instansi",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  instansi.getAllInstansi
);

router.get(
  "/instansi/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  instansi.getById
);

router.put(
  "/instansi/hide/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  instansi.hideInstansi
);

router.put(
  "/instansi/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  instansi.updateByid
);

router.delete(
  "/instansi/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  instansi.deleteByid
);

export default router;
