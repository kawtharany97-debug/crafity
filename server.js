const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Create connection to your XAMPP MySQL Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crafity_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected beautifully to crafity_db MySQL database!');
});

// Route to get macrame items
app.get('/api/products/macrame', (req, res) => {
    const sqlQuery = "SELECT * FROM products WHERE category = 'macrame'";
    db.query(sqlQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});