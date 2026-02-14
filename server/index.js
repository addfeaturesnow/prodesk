import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { getDb, initDb } from './db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initDb();

// Simple auth middleware (for now, accepts any request with a user-id header)
function authMiddleware(req, res, next) {
  req.userId = req.headers['x-user-id'] || 'user-1';
  next();
}

app.use(authMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// GET /api/groups - list all groups with leader and members
app.get('/api/groups', (req, res) => {
  const db = getDb();

  db.all(`
    SELECT id, name, leader_id, description, created_at FROM groups ORDER BY created_at DESC
  `, (err, groups) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: err.message });
    }

    // Fetch leader and members for each group
    let processed = 0;
    const result = groups.map(g => ({ ...g, leader: null, members: [] }));

    if (groups.length === 0) {
      db.close();
      return res.json(result);
    }

    groups.forEach((group, i) => {
      // Fetch leader
      if (group.leader_id) {
        db.get('SELECT id, name FROM divers WHERE id = ?', [group.leader_id], (err, leader) => {
          if (!err && leader) result[i].leader = leader;
          processed++;
          if (processed === groups.length * 2) {
            db.close();
            res.json(result);
          }
        });
      } else {
        processed++;
      }

      // Fetch members with diver info
      db.all(`
        SELECT gm.id, gm.role, d.id as diver_id, d.name
        FROM group_members gm
        JOIN divers d ON gm.diver_id = d.id
        WHERE gm.group_id = ?
      `, [group.id], (err, members) => {
        if (!err && members) {
          result[i].members = members.map(m => ({
            id: m.id,
            role: m.role,
            diver: { id: m.diver_id, name: m.name }
          }));
        }
        processed++;
        if (processed === groups.length * 2) {
          db.close();
          res.json(result);
        }
      });
    });
  });
});

// POST /api/groups - create a group
app.post('/api/groups', (req, res) => {
  const { name, leader_id, description } = req.body;
  const id = uuidv4();

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const db = getDb();
  db.run(
    'INSERT INTO groups (id, name, leader_id, description) VALUES (?, ?, ?, ?)',
    [id, name, leader_id || null, description || null],
    (err) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }

      // Fetch and return the created group
      db.get('SELECT id, name, leader_id, description, created_at FROM groups WHERE id = ?', [id], (err, group) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: group.id, name: group.name, leader_id: group.leader_id, description: group.description, created_at: group.created_at, leader: null, members: [] });
      });
    }
  );
});

// POST /api/groups/:groupId/members - add a member
app.post('/api/groups/:groupId/members', (req, res) => {
  const { diver_id, role } = req.body;
  const { groupId } = req.params;
  const id = uuidv4();

  if (!diver_id) {
    return res.status(400).json({ error: 'diver_id is required' });
  }

  const db = getDb();
  db.run(
    'INSERT INTO group_members (id, group_id, diver_id, role) VALUES (?, ?, ?, ?)',
    [id, groupId, diver_id, role || null],
    (err) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }

      // Fetch and return the created member
      db.get(`
        SELECT gm.id, gm.role, d.id as diver_id, d.name
        FROM group_members gm
        JOIN divers d ON gm.diver_id = d.id
        WHERE gm.id = ?
      `, [id], (err, member) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          id: member.id,
          role: member.role,
          diver: { id: member.diver_id, name: member.name }
        });
      });
    }
  );
});

// DELETE /api/groups/:groupId/members/:memberId - remove a member
app.delete('/api/groups/:groupId/members/:memberId', (req, res) => {
  const { memberId } = req.params;

  const db = getDb();
  db.run('DELETE FROM group_members WHERE id = ?', [memberId], (err) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

// GET /api/divers - list all divers (for dropdowns)
app.get('/api/divers', (req, res) => {
  const db = getDb();

  db.all('SELECT id, name FROM divers ORDER BY name ASC', (err, divers) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(divers || []);
  });
});

// POST /api/divers - create a diver (for testing)
app.post('/api/divers', (req, res) => {
  const { name, email } = req.body;
  const id = uuidv4();

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const db = getDb();
  db.run(
    'INSERT INTO divers (id, name, email) VALUES (?, ?, ?)',
    [id, name, email],
    (err) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }

      db.get('SELECT id, name FROM divers WHERE id = ?', [id], (err, diver) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(diver);
      });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
