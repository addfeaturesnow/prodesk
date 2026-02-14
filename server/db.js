import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'db.sqlite');

export function getDb() {
  return new sqlite3.Database(dbPath);
}

export function initDb() {
  return new Promise((resolve, reject) => {
    const db = getDb();

    db.serialize(() => {
      // Divers table
      db.run(`
        CREATE TABLE IF NOT EXISTS divers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          certification_level TEXT,
          medical_cleared INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Groups table
      db.run(`
        CREATE TABLE IF NOT EXISTS groups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          leader_id TEXT,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(leader_id) REFERENCES divers(id) ON DELETE SET NULL
        )
      `);

      // Group members table
      db.run(`
        CREATE TABLE IF NOT EXISTS group_members (
          id TEXT PRIMARY KEY,
          group_id TEXT NOT NULL,
          diver_id TEXT NOT NULL,
          role TEXT,
          joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE CASCADE,
          FOREIGN KEY(diver_id) REFERENCES divers(id) ON DELETE CASCADE,
          UNIQUE(group_id, diver_id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    db.close();
  });
}
