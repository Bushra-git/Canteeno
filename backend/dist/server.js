import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 4000;
// PostgreSQL connection pool setup
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
    port: parseInt(process.env.DB_PORT || '5432'),
});
app.use(express.json());
// Test route
app.get('/', (req, res) => {
    res.send('Canteen Management System Backend is running');
});
// Example API route to get all users (replace with your schema)
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
