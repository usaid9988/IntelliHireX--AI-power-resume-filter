const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  register,
  login,
  getMe,
  requestRecruiter
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.post("/request-recruiter", auth, requestRecruiter);

module.exports = router;
