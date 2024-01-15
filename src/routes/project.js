import express from "express";
import project from "../controller/project.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/project", Middleware.authMiddleware, project.createProject);
router.get("/project", Middleware.authMiddleware, project.getAllProject);
router.get("/project/:id", Middleware.authMiddleware, project.getById);
router.put("/project/:id", Middleware.authMiddleware, project.updateByid);
router.delete("/project/:id", Middleware.authMiddleware, project.deleteByid);

export default router;
