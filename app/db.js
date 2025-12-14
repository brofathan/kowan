const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db");

function initDB() {
  db.run(`
    CREATE TABLE IF NOT EXISTS magic_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    )
  `);
}

module.exports = { db, initDB };
