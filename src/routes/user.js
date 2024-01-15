import express from "express";
import User from "../controller/user.js";
import storage from "../utils/storage.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.put(
  "/user",
  Middleware.authMiddleware,
  storage.document.single("file"),
  User.updateUser
);

router.post(
  "/user/changepassword",
  Middleware.authMiddleware,
  User.changePassword
);
router.get("/user", Middleware.authMiddleware, User.getAllUser);
router.get("/user/:id", Middleware.authMiddleware, User.getById);
router.delete("/user/:id", Middleware.authMiddleware, User.deleteByid);

export default router;
