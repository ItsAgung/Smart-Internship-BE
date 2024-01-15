import express from "express";
import admin from "../controller/admin.js";
import Middleware from "../middleware/auth-middleware.js";
import storage from "../utils/storage.js";

const router = express.Router();

router.get(
  "/admin/dashboard",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  admin.getAllDashboard
);

router.get(
  "/admin/user",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  admin.getAllUser
);

router.get(
  "/admin/notifikasi",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  admin.notification
);

router.get(
  "/admin/monitoring",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  admin.getMonitoring
);

router.put(
  "/admin/pengajuan/administrasi/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  admin.aproveUserAdministrasi
);

router.put(
  "/admin/pengajuan/tes_kemampuan/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  admin.aproveUserKemampuan
);

router.put(
  "/admin/pengajuan/wawancara/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  admin.aproveUserWawancara
);

router.post(
  "/admin/sertifikat",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  storage.certificate.single("file"),
  admin.insertCertificate
);

router.post(
  "/admin/user/sertifikat",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  admin.giveCertificate
);

router.post(
  "/admin/posisi/sertifikat",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  storage.certificate.single("file"),
  admin.insertCertificatePosisi
);

router.get(
  "/admin/alumni",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  admin.getAllAlumni
);

router.get(
  "/super_admin/admin",
  Middleware.authMiddleware,
  Middleware.superAdminOnly,
  admin.getAllAdmin
);

router.post(
  "/super_admin/admin",
  Middleware.authMiddleware,
  Middleware.superAdminOnly,
  admin.createAdmin
);

router.put(
  "/super_admin/admin/:id",
  Middleware.authMiddleware,
  Middleware.superAdminOnly,
  admin.updateAdmin
);

router.delete(
  "/super_admin/admin/:id",
  Middleware.authMiddleware,
  Middleware.superAdminOnly,
  admin.deleteAdmin
);

export default router;
