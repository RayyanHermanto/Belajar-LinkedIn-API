import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { nama, email, password, role } = req.body;

        if (!nama || !email || !password)
            return res.status(400).json({ error: "Missing fields" });

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
        const hashed = await bcrypt.hash(password, saltRounds);

        let userRole = "user";

        if (role && role.toLowerCase() === "admin") {
            userRole = "admin";
        }

        const result = await db.query(
            "INSERT INTO users (nama, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, nama, email, role, created_at",
            [nama, email, hashed, userRole],
        );

        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        if (err.code === "23505")
            return res.status(409).json({ error: "Email sudah terdaftar" });
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Missing fields" });
        const userQ = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = userQ.rows[0];
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "8h" },
        );
        res.json({
            token,
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/me", authenticate, async (req, res) => {
    try {
        const q = await db.query(
            "SELECT id, nama, email, role, created_at FROM users WHERE id = $1",
            [req.user.id],
        );
        if (!q.rows[0]) return res.status(404).json({ error: "User not found" });
        res.json({ user: q.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
