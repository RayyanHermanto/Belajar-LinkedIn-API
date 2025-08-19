// setup.js
import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";
dotenv.config();

async function setup() {
  const client = new Client({
    connectionString: process.env.DATABASE_SUPER_URL,
  });

  try {
    await client.connect();

    await client
      .query(
        `
      CREATE DATABASE "Belajar_LinkedIn_Class"
    `,
      )
      .catch((err) => {
        if (err.code === "42P04") {
          console.log("Database sudah ada, skip.");
        } else throw err;
      });

    console.log("Database checked/created.");
    await client.end();

    const dbClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await dbClient.connect();

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nama TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        instructor TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, class_id)
      );
    `);

    console.log("Tables created/ensured.");
    await dbClient.end();
  } catch (err) {
    console.error("Error setup:", err);
    process.exit(1);
  }
}

export default setup;
