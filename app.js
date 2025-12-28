const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resumes", require("./routes/resumeRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/export", require("./routes/exportRoutes"));

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
