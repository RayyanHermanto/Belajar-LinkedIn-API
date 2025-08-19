import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";
import enrollmentsRouter from "./routes/enrollments.js";
import setup from "./setup.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Belajar_LinkedIn_Class API running"));

app.use("/api/users", usersRouter);
app.use("/api/classes", classesRouter);
app.use("/api/enrollments", enrollmentsRouter);

const PORT = process.env.PORT || 3000;

(async () => {
    await setup();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})();
