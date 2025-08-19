import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
    const parts = authHeader.split(" ");
    if (parts.length !== 2) return res.status(401).json({ error: "Token error" });
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme))
        return res.status(401).json({ error: "Token malformatted" });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token invalid" });
        req.user = decoded; // { id, email, role }
        next();
    });
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== "admin")
        return res.status(403).json({ error: "Requires admin" });
    next();
};
