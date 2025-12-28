const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { exportCSV } = require("../controllers/exportController");

router.get("/export", auth, role("admin"), exportCSV);

module.exports = router;
