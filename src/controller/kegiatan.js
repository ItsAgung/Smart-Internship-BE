import kegiatanService from "../service/kegiatan.js";

export default class kegiatan {
  static getAllkegiatan = async (req, res, next) => {
    try {
      const result = await kegiatanService.getAll(req);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data kegiatan",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const result = await kegiatanService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data kegiatan",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateByid = async (req, res, next) => {
    try {
      await kegiatanService.updateById(req.body, req.params.id);
      return res.status(200).json({
        status: true,
        message: "update data kegiatan sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteByid = async (req, res, next) => {
    try {
      await kegiatanService.deleteById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "hapus data kegiatan sukses",
      });
    } catch (error) {
      next(error);
    }
  };
}
