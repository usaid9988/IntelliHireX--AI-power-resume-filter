const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password, role, company } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const user = await User.create({
    name,
    email,
    password,
    role,
    company,
    approved: role === "candidate"
  });

  res.json({
    message:
      role === "recruiter"
        ? "Recruiter registered. Await admin approval."
        : "Candidate registered successfully"
  });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  if (user.role === "recruiter" && !user.approved) {
    return res.status(403).json({ message: "Recruiter not approved" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    role: user.role,
    approved: user.approved,
    name: user.name
  });
};

// ME
exports.getMe = (req, res) => {
  res.json(req.user);
};

// candidate -- request recruiter
exports.requestRecruiter = async (req, res) => {
  try {
    const { company } = req.body;

    if (!company) {
      return res.status(400).json({ message: "Company name required" });
    }

    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply" });
    }

    req.user.role = "recruiter";
    req.user.approved = false;
    req.user.company = company;

    await req.user.save();

    res.json({ message: "Recruiter application submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Request failed" });
  }
};


// admin -- approve recruiter
exports.approveRecruiter = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.approved = true;
  await user.save();

  res.json({ message: "Recruiter approved" });
};

