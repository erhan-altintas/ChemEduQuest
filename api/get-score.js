import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    // ✅ CORS headers toestaan
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Preflight fix
    }

    try {
        const result = await pool.query(
            "SELECT name, score, timestamp FROM scores ORDER BY score DESC LIMIT 10"
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("DB fout:", error);
        res.status(500).json({ error: "Databasefout" });
    }
}
