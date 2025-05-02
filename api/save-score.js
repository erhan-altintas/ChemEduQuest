import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Alleen POST toegestaan');

    const { name, score } = req.body;
    if (!name || typeof score !== 'number') {
        return res.status(400).send('Ongeldige invoer');
    }

    try {
        await pool.query('INSERT INTO scores (name, score) VALUES ($1, $2)', [name, score]);
        res.status(200).json({ message: 'Score opgeslagen' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Databasefout' });
    }
}
