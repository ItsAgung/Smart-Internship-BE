import adminService from "../service/admin.js";

export default class Admin {
  static getAllDashboard = async (req, res, next) => {
    try {
      const result = await adminService.getAllDashboard();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data dashboard",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllUser = async (req, res, next) => {
    try {
      const result = await adminService.getAllUser(req);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data user",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getMonitoring = async (req, res, next) => {
    try {
      const result = await adminService.getMonitoring();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data monitoring",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static aproveUserAdministrasi = async (req, res, next) => {
    try {
      const result = await adminService.aproveUserAdministrasi(
        req,
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

  static aproveUserKemampuan = async (req, res, next) => {
    try {
      const result = await adminService.aproveUserKemampuan(req, req.params.id);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static aproveUserWawancara = async (req, res, next) => {
    try {
      const result = await adminService.aproveUserWawancara(req, req.params.id);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static notification = async (req, res, next) => {
    try {
      const result = await adminService.notification();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data notifikasi",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static insertCertificate = async (req, res, next) => {
    try {
      const result = await adminService.insertCertificate(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static insertCertificatePosisi = async (req, res, next) => {
    try {
      const result = await adminService.insertCertificatePosisi(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static giveCertificate = async (req, res, next) => {
    try {
      const result = await adminService.giveCertificate(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllAlumni = async (req, res, next) => {
    try {
      const result = await adminService.getAllAlumni();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data alumni",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllAdmin = async (req, res, next) => {
    try {
      const result = await adminService.getAllAdmin();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data admin",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static createAdmin = async (req, res, next) => {
    try {
      const result = await adminService.createAdmin(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateAdmin = async (req, res, next) => {
    try {
      const result = await adminService.updateAdmin(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteAdmin = async (req, res, next) => {
    try {
      const result = await adminService.deleteAdmin(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
