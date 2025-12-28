const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// Admin-only middleware
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

// Get pending recruiters
router.get("/pending-recruiters", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({
      role: "recruiter",
      approved: false
    }).select("-password");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recruiters" });
  }
});

// Approve recruiter
router.put("/approve/:id", auth, isAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { approved: true });
  res.json({ message: "Recruiter approved" });
});

module.exports = router;
