import authService from "../service/auth.js";

export default class Auth {
  static register = async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json({
        status: true,
        message: "register succes",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  static login = async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      if (result.id) {
        return res.status(200).json(result);
      }
      return res.status(200).json({
        status: true,
        message: "login succes",
        data: {
          token: result,
        },
      });
    } catch (e) {
      next(e);
    }
  };

  static activation = async (req, res, next) => {
    try {
      const result = await authService.activation(req.body);

      return res.status(200).json({
        status: true,
        message: result.message,
        data: result.token,
      });
    } catch (err) {
      next(err);
    }
  };

  static sendOtp = async (req, res, next) => {
    try {
      const result = await authService.sendOtp(req.body);

      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (err) {
      next(err);
    }
  };

  static forgotPassword = async (req, res, next) => {
    try {
      const result = await authService.forgotPassword(req.body);

      return res.status(200).json({
        status: true,
        message: result.message,
        data: result.token,
      });
    } catch (err) {
      next(err);
    }
  };

  static resetPassword = async (req, res, next) => {
    try {
      const result = await authService.resetPassword(req.body);

      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
