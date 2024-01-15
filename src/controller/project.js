import projectService from "../service/project.js";

export default class Project {
  static createProject = async (req, res, next) => {
    try {
      const result = await projectService.create(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllProject = async (req, res, next) => {
    try {
      const result = await projectService.getAll(req);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data project",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const result = await projectService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data project",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateByid = async (req, res, next) => {
    try {
      await projectService.updateById(req.body, req.params.id);
      return res.status(200).json({
        status: true,
        message: "update data project sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteByid = async (req, res, next) => {
    try {
      await projectService.deleteById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "hapus data project sukses",
      });
    } catch (error) {
      next(error);
    }
  };
}
