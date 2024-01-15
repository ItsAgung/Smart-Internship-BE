import instansiService from "../service/instansi.js";

export default class instansi {
  static createInstansi = async (req, res, next) => {
    try {
      const result = await instansiService.create(req.body);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllInstansi = async (req, res, next) => {
    try {
      const result = await instansiService.getAll(req);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data instansi",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const result = await instansiService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data instansi",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static hideInstansi = async (req, res, next) => {
    try {
      const result = await instansiService.hideInstansi(
        req.body,
        req.params.id
      );

      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateByid = async (req, res, next) => {
    try {
      await instansiService.updateById(req.body, req.params.id);
      return res.status(200).json({
        status: true,
        message: "update data instansi sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteByid = async (req, res, next) => {
    try {
      await instansiService.deleteById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "hapus data instansi sukses",
      });
    } catch (error) {
      next(error);
    }
  };
}
