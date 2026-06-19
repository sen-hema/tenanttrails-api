import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const result = await new Promise((ok, no) =>
      cloudinary.uploader
        .upload_stream({ folder: "tenanttrails" }, (e, r) =>
          e ? no(e) : ok(r)
        )
        .end(req.file.buffer)
    );
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;