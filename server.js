const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(bodyParser.json());

// Create users table
db.run(`CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  fullname TEXT,
  username TEXT UNIQUE,
  age INTEGER,
  email TEXT,
  contact TEXT,
  password TEXT
)`);

// Registration endpoint
app.post('/register', async (req, res) => {
  const { fullname, username, age, email, contact, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (fullname, username, age, email, contact, password) VALUES (?, ?, ?, ?, ?, ?)`,
    [fullname, username, age, email, contact, hashedPassword],
    (err) => {
      if (err) {
        return res.status(400).json({ message: 'User already exists!' });
      }
      res.json({ message: 'Registration successful!' });
    }
  );
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (!row || !bcrypt.compareSync(password, row.password)) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
    res.json({ success: true, message: 'Login successful!' });
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
