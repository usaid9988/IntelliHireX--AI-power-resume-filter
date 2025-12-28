const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname,"../uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename:(req,file,cb)=>{ cb(null, Date.now()+path.extname(file.originalname)); }
});

module.exports = multer({
  storage,
  limits:{ fileSize:5*1024*1024 },
  fileFilter(req,file,cb){
    if(!file.originalname.endsWith(".pdf")) return cb(new Error("Only PDFs allowed"));
    cb(null,true);
  }
});
