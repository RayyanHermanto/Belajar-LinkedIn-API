import express from "express";
import db from "../db.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/admin/", authenticate, authorizeAdmin, async (req, res) => {
    try {
        const { title, description, instructor } = req.body;
        const q = await db.query(
            "INSERT INTO classes (title, description, instructor) VALUES ($1,$2,$3) RETURNING *",
            [title, description, instructor],
        );
        res.status(201).json({ class: q.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const q = await db.query("SELECT * FROM classes ORDER BY created_at DESC");
        res.json({ classes: q.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const q = await db.query("SELECT * FROM classes WHERE id = $1", [req.params.id,]);
        if (!q.rows[0]) return res.status(404).json({ error: "Class not found" });
        res.json({ class: q.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/admin/:id", authenticate, authorizeAdmin, async (req, res) => {
    try {
        const { title, description, instructor } = req.body;
        const q = await db.query(
            "UPDATE classes SET title=$1, description=$2, instructor=$3 WHERE id=$4 RETURNING *",
            [title, description, instructor, req.params.id],
        );
        if (!q.rows[0]) return res.status(404).json({ error: "Class not found" });
        res.json({ class: q.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/admin/:id", authenticate, authorizeAdmin, async (req, res) => {
    try {
        await db.query("DELETE FROM classes WHERE id=$1", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
