import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash]
    );
    res.status(201).json({ token: signToken(result.insertId) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [[user]] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Invalid credentials" });

    res.json({ token: signToken(user.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET /api/auth/me — logged-in user + their reviews
router.get("/me", auth, async (req, res) => {
  try {
    const [[user]] = await pool.query(
      "SELECT id, name, email, initials FROM users WHERE id = ?",
      [req.user.id]
    );
    const [reviews] = await pool.query(
      `SELECT r.id, r.apt_id AS aptId, r.rating, r.body, 
              r.created AS date, a.name AS aptName
       FROM reviews r
       JOIN apartments a ON a.id = r.apt_id
       WHERE r.user_id = ?`,
      [req.user.id]
    );
    res.json({ ...user, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;