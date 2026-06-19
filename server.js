import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";
import { auth } from "./middleware/auth.js";
import apartmentRoutes from "./routes/apartments.js";
import reviewRoutes from "./routes/reviews.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ db: "connected", result: rows[0].result });
  } catch (err) {
    res.status(500).json({ db: "error", message: err.message });
  }
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