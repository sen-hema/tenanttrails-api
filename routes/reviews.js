import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// POST a comment on a review
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { body } = req.body;
    const [result] = await pool.query(
      "INSERT INTO comments (review_id, user_id, body, created) VALUES (?, ?, ?, NOW())",
      [req.params.id, req.user.id, body]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT edit a review (owner only)
router.put("/:id", auth, async (req, res) => {
  try {
    const [[review]] = await pool.query(
      "SELECT user_id FROM reviews WHERE id = ?",
      [req.params.id]
    );
    if (!review) return res.status(404).json({ error: "Not found" });
    if (review.user_id !== req.user.id)
      return res.status(403).json({ error: "Not your review" });

    const { rating, body } = req.body;
    await pool.query("UPDATE reviews SET rating = ?, body = ? WHERE id = ?", [
      rating,
      body,
      req.params.id,
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a review (owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const [[review]] = await pool.query(
      "SELECT user_id FROM reviews WHERE id = ?",
      [req.params.id]
    );
    if (!review) return res.status(404).json({ error: "Not found" });
    if (review.user_id !== req.user.id)
      return res.status(403).json({ error: "Not your review" });

    await pool.query("DELETE FROM reviews WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
