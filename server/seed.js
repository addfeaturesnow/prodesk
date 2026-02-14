import { getDb } from './db.js';
import { v4 as uuidv4 } from 'uuid';

const db = getDb();

const divers = [
  { name: 'John Smith', email: 'john@example.com' },
  { name: 'Sarah Johnson', email: 'sarah@example.com' },
  { name: 'Mike Davis', email: 'mike@example.com' },
  { name: 'Emily Brown', email: 'emily@example.com' },
  { name: 'Alex Lee', email: 'alex@example.com' },
];

console.log('Seeding divers...');

db.serialize(() => {
  divers.forEach((diver) => {
    db.run(
      'INSERT OR IGNORE INTO divers (id, name, email) VALUES (?, ?, ?)',
      [uuidv4(), diver.name, diver.email],
      (err) => {
        if (err) {
          console.error(`Error inserting ${diver.name}:`, err);
        } else {
          console.log(`Added ${diver.name}`);
        }
      }
    );
  });
});

db.close(() => {
  console.log('Seeding complete!');
});
