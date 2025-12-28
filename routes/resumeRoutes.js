const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const multer = require("multer");
const path = require("path");

const { uploadResume, getRankedResumes } =
  require("../controllers/resumeController");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post(
  "/upload",
  auth,
  role("candidate", "recruiter"),
  upload.single("resume"),
  uploadResume
);

router.get(
  "/ranked",
  auth,
  role("recruiter", "admin"),
  getRankedResumes
);

router.get(
  "/download/:file",
  auth,
  role("recruiter", "admin"),
  (req, res) => {
    res.download(path.join(__dirname, "../uploads", req.params.file));
  }
);

module.exports = router;
