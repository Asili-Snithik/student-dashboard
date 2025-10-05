const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite DB
const db = new sqlite3.Database('./student_dashboard.db', (err) => {
  if (err) console.error('❌ DB Error:', err);
  else console.log('✅ Connected to SQLite database.');
});

// Create tables and insert defaults
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    instructor TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    due TEXT
  )`);

  db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
    if (row && row.count === 0)
      db.run(`INSERT INTO users (username, password) VALUES ('student', '12345')`);
  });
  db.get('SELECT COUNT(*) AS count FROM courses', (err, row) => {
    if (row && row.count === 0) {
      db.run(`INSERT INTO courses (name, instructor) VALUES ('Web Development', 'John Doe')`);
      db.run(`INSERT INTO courses (name, instructor) VALUES ('Data Structures', 'Jane Smith')`);
    }
  });
  db.get('SELECT COUNT(*) AS count FROM tasks', (err, row) => {
    if (row && row.count === 0) {
      db.run(`INSERT INTO tasks (title, due) VALUES ('Assignment 1', '2025-10-10')`);
      db.run(`INSERT INTO tasks (title, due) VALUES ('Quiz 2', '2025-10-12')`);
    }
  });
});

// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    if (row) return res.json({ success: true });
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  });
});

// GET COURSES
app.get('/courses', (req, res) => {
  db.all('SELECT * FROM courses ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ADD COURSE
app.post('/courses', (req, res) => {
  const { name, instructor } = req.body;
  if (!name || !instructor) return res.status(400).json({ error: 'All fields required' });

  db.run('INSERT INTO courses (name, instructor) VALUES (?, ?)', [name, instructor], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM courses WHERE id = ?', [this.lastID], (err, row) => res.json(row));
  });
});

// GET TASKS
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ADD TASK
app.post('/tasks', (req, res) => {
  const { title, due } = req.body;
  if (!title || !due) return res.status(400).json({ error: 'All fields required' });

  db.run('INSERT INTO tasks (title, due) VALUES (?, ?)', [title, due], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => res.json(row));
  });
});

// Start Server
app.listen(5000, () => console.log(' Backend running on http://localhost:5000'));
