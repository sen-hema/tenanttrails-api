import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// POST a comment on a review (protected)
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

export default router;