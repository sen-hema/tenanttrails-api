import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// GET all apartments with rating + review count
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*,
        ROUND(AVG(r.rating), 1) AS rating,
        COUNT(r.id) AS reviews
      FROM apartments a
      LEFT JOIN reviews r ON r.apt_id = a.id
      GROUP BY a.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one apartment with its reviews
router.get("/:id", async (req, res) => {
  try {
    const [[apartment]] = await pool.query(
      "SELECT * FROM apartments WHERE id = ?",
      [req.params.id]
    );
    if (!apartment) return res.status(404).json({ error: "Not found" });

    const [reviews] = await pool.query(
      "SELECT * FROM reviews WHERE apt_id = ?",
      [req.params.id]
    );
    res.json({ ...apartment, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a review (protected — author comes from the token)
router.post("/:id/reviews", auth, async (req, res) => {
  try {
    const { rating, body } = req.body;
    const [result] = await pool.query(
      "INSERT INTO reviews (apt_id, user_id, rating, body, created) VALUES (?, ?, ?, ?, NOW())",
      [req.params.id, req.user.id, rating, body]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;