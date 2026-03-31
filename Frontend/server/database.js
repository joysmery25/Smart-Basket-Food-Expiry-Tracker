const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'smartbasket.db');
const db = new Database(dbPath);

function initDb() {
  console.log('Initializing database...');

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT, -- Can be null for purely OAuth users, but we'll enforce password for email/pass
      google_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Login History table
  db.exec(`
    CREATE TABLE IF NOT EXISTS login_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      ip TEXT,
      user_agent TEXT,
      success BOOLEAN NOT NULL,
      method TEXT NOT NULL, -- 'password', 'google'
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Food Items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      expiry_date DATE NOT NULL,
      purchase_date DATE,
      storage TEXT,
      quantity REAL NOT NULL,
      unit TEXT,
      urgency TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Community Posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      quantity TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      note TEXT,
      building TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'claimed'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // User Stats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      food_saved REAL DEFAULT 0,
      co2_saved REAL DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      recipes_cooked INTEGER DEFAULT 0,
      last_activity_date DATE
    )
  `);

  console.log('Database initialized successfully.');
}

module.exports = {
  db,
  initDb
};
