import jurusanService from "../service/jurusan.js";

export default class jurusan {
  static createjurusan = async (req, res, next) => {
    try {
      const result = await jurusanService.create(req.body);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllJurusanInstansi = async (req, res, next) => {
    try {
      const result = await jurusanService.getAllJurusanInstansi();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data jurusan dan instasi",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAlljurusan = async (req, res, next) => {
    try {
      const result = await jurusanService.getAll(req);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data jurusan",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const result = await jurusanService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data jurusan",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateByid = async (req, res, next) => {
    try {
      await jurusanService.updateById(req.body, req.params.id);
      return res.status(200).json({
        status: true,
        message: "update data jurusan sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteByid = async (req, res, next) => {
    try {
      await jurusanService.deleteById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "hapus data jurusan sukses",
      });
    } catch (error) {
      next(error);
    }
  };
}
