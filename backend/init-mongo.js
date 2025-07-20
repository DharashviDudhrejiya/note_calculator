// MongoDB initialization script
db = db.getSiblingDB('note-calculator');

// Create collections
db.createCollection('notes');
db.createCollection('users');

// Create indexes for better performance
db.notes.createIndex({ "title": "text", "content": "text" });
db.notes.createIndex({ "userId": 1, "createdAt": -1 });
db.notes.createIndex({ "shareToken": 1 });
db.notes.createIndex({ "tags": 1 });

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "isActive": 1 });

// Insert sample data
db.notes.insertMany([
  {
    title: "Daily Expenses",
    content: `Coffee: 3.50
Lunch: 8.20
Snacks: 2.30
Total: =3.50 + 8.20 + 2.30

Tip (15%): =Total * 0.15
Grand Total: =Total + Tip`,
    tags: ["expenses", "daily"],
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Project Estimate",
    content: `Design: 20 hours x $30 = 600
Dev: 50 hours x $40 = 2000
QA: 15 hours x $25 = 375
Total: =600 + 2000 + 375

Client Budget: 4000
Remaining: =4000 - Total`,
    tags: ["work", "estimate"],
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized successfully!');