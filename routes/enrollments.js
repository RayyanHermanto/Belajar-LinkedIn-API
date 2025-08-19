import express from "express";
import db from "../db.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/:classId", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const classId = parseInt(req.params.classId);

        const cl = await db.query("SELECT id FROM classes WHERE id=$1", [classId]);
        if (!cl.rows[0]) return res.status(404).json({ error: "Class not found" });

        const ins = await db.query(
            "INSERT INTO enrollments (user_id, class_id) VALUES ($1,$2) ON CONFLICT DO NOTHING RETURNING *",
            [userId, classId],
        );
        if (!ins.rows[0])
            return res.status(409).json({ error: "Already enrolled" });
        res.status(201).json({ enrollment: ins.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/admin/:classId", authenticate, authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.body;
        const classId = parseInt(req.params.classId);

        if (!userId) return res.status(400).json({ error: "userId is required" });

        const cl = await db.query("SELECT id FROM classes WHERE id=$1", [
            classId,
        ]);
        if (!cl.rows[0])
            return res.status(404).json({ error: "Class not found" });

        const usr = await db.query("SELECT id FROM users WHERE id=$1", [userId]);
        if (!usr.rows[0])
            return res.status(404).json({ error: "User not found" });

        const ins = await db.query(
            "INSERT INTO enrollments (user_id, class_id) VALUES ($1,$2) ON CONFLICT DO NOTHING RETURNING *",
            [userId, classId],
        );
        if (!ins.rows[0])
            return res.status(409).json({ error: "User already enrolled" });
        res.status(201).json({ enrollment: ins.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
    
});

router.get("/me", authenticate, async (req, res) => {
    try {
        const q = await db.query(
        `SELECT e.id, e.enrolled_at, c.id as class_id, c.title, c.description, c.instructor
        FROM enrollments e
        JOIN classes c ON c.id = e.class_id
        WHERE e.user_id = $1
        ORDER BY e.enrolled_at DESC`,
        [req.user.id],
        );
        res.json({ enrollments: q.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/class/:classId", authenticate, async (req, res) => {
    try {
        const classId = parseInt(req.params.classId);
        const q = await db.query(
        `SELECT e.id, e.enrolled_at, u.id as user_id, u.nama, u.email
        FROM enrollments e
        JOIN users u ON u.id = e.user_id
        WHERE e.class_id = $1
        ORDER BY e.enrolled_at DESC`,
        [classId],
        );
        res.json({ enrollments: q.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/:classId", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const classId = parseInt(req.params.classId);

        const del = await db.query(
            "DELETE FROM enrollments WHERE user_id=$1 AND class_id=$2 RETURNING *",
            [userId, classId],
        );

        if (!del.rows[0])
            return res.status(404).json({ error: "Enrollment not found" });

        res.json({ message: "You have unenrolled from this class" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/admin/:classId/:userId", authenticate, authorizeAdmin, async (req, res) => {
    try {
        const classId = parseInt(req.params.classId);
        const userId = parseInt(req.params.userId);

        const del = await db.query(
            "DELETE FROM enrollments WHERE user_id=$1 AND class_id=$2 RETURNING *",
            [userId, classId],
        );

        if (!del.rows[0])
            return res.status(404).json({ error: "Enrollment not found" });

        res.json({ message: "User has been removed from the class" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
},
);

export default router;
