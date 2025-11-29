import { Router } from "express";
import db from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// Health check
router.get("/", (req, res) => {
  res.json({ message: "Auth route working" });
});

// Login with username/email + password
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    const [rows] = await db.query(
      "SELECT person_id, person_name, username, password, role, email FROM person WHERE username = ? OR email = ? LIMIT 1",
      [username, username]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.person_id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        person_id: user.person_id,
        person_name: user.person_name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
