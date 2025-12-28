const Resume = require("../models/Resume");
const skillsMap = require("../config/jobSkills");

const scoreResume = (skills, role) => {
  const target = skillsMap[role] || [];
  let score = 0;
  skills.forEach(s => {
    score += target.includes(s) ? 15 : 5;
  });
  return Math.min(score, 100);
};

exports.uploadResume = async (req, res) => {
  const { name, email, role, skills } = req.body;

  const parsedSkills = JSON.parse(skills);
  const score = scoreResume(parsedSkills, role);

  const resume = await Resume.create({
    name,
    email,
    role,
    skills: parsedSkills,
    score,
    filename: req.file.filename
  });

  res.json({ message: "Resume uploaded", resume });
};

exports.getRankedResumes = async (req, res) => {
  const resumes = await Resume.find().sort({ score: -1 });
  res.json(resumes);
};
