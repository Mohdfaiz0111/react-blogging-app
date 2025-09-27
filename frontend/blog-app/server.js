const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const app = express();
const db = new Database('/data/blog.db');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT
  );
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );
`);

app.post('/api/users', (req, res) => {
  const { username, password_hash } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    const result = stmt.run(username, password_hash);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

app.post('/api/login', (req, res) => {
  const { username, password_hash } = req.body;
  try {
    const stmt = db.prepare('SELECT id FROM users WHERE username = ? AND password_hash = ?');
    const user = stmt.get(username, password_hash);
    if (user) {
      res.json({ id: user.id });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

app.post('/api/posts', (req, res) => {
  const { title, content, author_id } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)');
    stmt.run(title, content, author_id);
    res.status(201).send('Post created');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

app.get('/api/posts', (req, res) => {
  const { search = '' } = req.query;
  const stmt = db.prepare('SELECT p.*, u.username FROM posts p JOIN users u ON p.author_id = u.id WHERE p.title LIKE ?');
  const posts = stmt.all(`%${search}%`);
  res.json(posts);
});

app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    stmt.run(id);
    res.send('Post deleted');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));
