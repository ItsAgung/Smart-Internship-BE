import userService from "../service/user.js";

export default class User {
  static updateUser = async (req, res, next) => {
    try {
      const result = await userService.updateUser(req);

      return res.status(200).json({
        status: result,
        message: "update data user sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllUser = async (req, res, next) => {
    try {
      const result = await userService.getAll();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data user",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const result = await userService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data user",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteByid = async (req, res, next) => {
    try {
      await userService.deleteById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "hapus data user sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static changePassword = async (req, res, next) => {
    try {
      const result = await userService.changePassword(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
