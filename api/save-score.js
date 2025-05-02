import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    // ✅ CORS headers toestaan
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Preflight fix
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Alleen POST toegestaan" });
    }

    const { name, score } = req.body;

    if (!name || typeof score !== "number") {
        return res.status(400).json({ error: "Ongeldige invoer" });
    }

    try {
        await pool.query("INSERT INTO scores (name, score) VALUES ($1, $2)", [name, score]);
        res.status(200).json({ message: "Score opgeslagen" });
    } catch (error) {
        console.error("DB fout:", error);
        res.status(500).json({ error: "Databasefout" });
    }
}
