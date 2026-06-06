import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  console.log(
    "📤 Upload middleware - File received:",
    file.originalname,
    "Type:",
    file.mimetype,
  );
  if (file.mimetype.startsWith("image/")) {
    console.log("✅ File accepted (image)");
    cb(null, true);
    return;
  }

  console.log("❌ File rejected (not an image)");
  cb(new Error("Only image files are allowed"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
