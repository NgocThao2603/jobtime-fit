// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Test API /api/ping
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Test MySQL connection
app.get('/api/test-db', async (req, res) => {
  try {
    // Kiểm tra kết nối bằng cách query SELECT 1
    const [rows] = await db.query('SELECT 1');
    res.json({ message: 'Connected to the database!', result: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed', details: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
