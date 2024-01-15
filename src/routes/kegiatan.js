import express from "express";
import kegiatan from "../controller/kegiatan.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/kegiatan", Middleware.authMiddleware, kegiatan.getAllkegiatan);
router.get("/kegiatan/:id", Middleware.authMiddleware, kegiatan.getById);
router.put("/kegiatan/:id", Middleware.authMiddleware, kegiatan.updateByid);
router.delete("/kegiatan/:id", Middleware.authMiddleware, kegiatan.deleteByid);

export default router;
