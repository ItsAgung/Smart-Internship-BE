import periodeService from "../service/periode.js";

export default class Periode {
  static createPeriode = async (req, res, next) => {
    try {
      const result = await periodeService.create(req.body);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllPeriode = async (req, res, next) => {
    try {
      const result = await periodeService.getAll();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data periode",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const result = await periodeService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data periode",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateByid = async (req, res, next) => {
    try {
      await periodeService.updateById(req.body, req.params.id);
      return res.status(200).json({
        status: true,
        message: "update data periode sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteByid = async (req, res, next) => {
    try {
      await periodeService.deleteById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "hapus data periode sukses",
      });
    } catch (error) {
      next(error);
    }
  };
}
