import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";
import apartmentRoutes from "./routes/apartments.js";
import reviewRoutes from "./routes/reviews.js";
import uploadRoutes from "./routes/upload.js";
import { auth } from "./middleware/auth.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/protected-test", auth, (req, res) => {
  res.json({ message: "You're authenticated", user: req.user });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API on http://localhost:${process.env.PORT || 3000}`);
  });
}

export default app;