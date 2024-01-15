import express from "express";
import periode from "../controller/periode.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/periode", Middleware.authMiddleware, periode.createPeriode);
router.get("/periode", Middleware.authMiddleware, periode.getAllPeriode);
router.get("/periode/:id", Middleware.authMiddleware, periode.getById);
router.put("/periode/:id", Middleware.authMiddleware, periode.updateByid);
router.delete("/periode/:id", Middleware.authMiddleware, periode.deleteByid);

export default router;
