import express from "express";
import routeAuth from "./auth.js";
import routeUser from "./user.js";
import routePosisi from "./posisi.js";
import routeInstansi from "./instansi.js";
import routePengajuan from "./pengajuan.js";
import routeKegiatan from "./kegiatan.js";
import routeJurusan from "./jurusan.js";
import routeProject from "./project.js";
import routeAdmin from "./admin.js";
const router = express.Router();

router.use(routeAuth);
router.use(routeAdmin);
router.use(routeUser);
router.use(routePosisi);
router.use(routePengajuan);
router.use(routeInstansi);
router.use(routeKegiatan);
router.use(routeJurusan);
router.use(routeProject);

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "selamat datang di api server smart internship",
  });
});

export default router;
