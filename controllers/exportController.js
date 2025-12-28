const Resume = require("../models/Resume");
const { Parser } = require("json2csv");

exports.exportCSV = async (req, res) => {
  const resumes = await Resume.find().sort({ score: -1 });

  const fields = ["name", "email", "role", "score", "matchedSkills"];
  const parser = new Parser({ fields });
  const csv = parser.parse(resumes);

  res.header("Content-Type", "text/csv");
  res.attachment("intellihire_rankings.csv");
  res.send(csv);
};
