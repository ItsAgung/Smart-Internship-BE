import dotenv from "dotenv";
dotenv.config();
import ResponseError from "../error/response-error.js";
import jwt from "jsonwebtoken";
const { JWT_SECRET_KEY = "secret" } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new ResponseError(400, "you're not authorized!");
    }

    const token = authorization.split("Bearer ")[1];
    const data = await jwt.verify(token, JWT_SECRET_KEY);

    if (!data) {
      throw new ResponseError(400, "you're not authorized!");
    }

    req.user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    next();
  } catch (e) {
    next(e);
  }
};

const adminOnly = async (req, res, next) => {
  try {
    if (req.user.role.toUpperCase() == "USER") {
      throw new ResponseError(400, "you're not authorized!");
    }
    next();
  } catch (error) {
    next(error);
  }
};

const superAdminOnly = async (req, res, next) => {
  try {
    if (req.user.role.toUpperCase() == "SUPERADMIN") {
      next();
    } else {
      throw new ResponseError(400, "you're not authorized!");
    }
  } catch (error) {
    next(error);
  }
};

export default { authMiddleware, adminOnly, superAdminOnly };
