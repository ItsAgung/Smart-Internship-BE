import pengajuanService from "../service/pengajuan.js";

export default class Pengajuan {
  static createPengajuan = async (req, res, next) => {
    try {
      const result = await pengajuanService.create(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllPengajuan = async (req, res, next) => {
    try {
      const result = await pengajuanService.getAll();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data pengajuan",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const result = await pengajuanService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data pengajuan",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteByid = async (req, res, next) => {
    try {
      await pengajuanService.deleteById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "hapus data pengajuan sukses",
      });
    } catch (error) {
      next(error);
    }
  };
}
