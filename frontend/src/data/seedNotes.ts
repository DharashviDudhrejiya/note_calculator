import { Note } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

export const seedNotes: Note[] = [
  {
    id: uuidv4(),
    title: 'Daily Expenses',
    content: `Coffee: 3.50
Lunch: 8.20
Snacks: 2.30
Total: =3.50 + 8.20 + 2.30

Tip (15%): =Total * 0.15
Grand Total: =Total + Tip`,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['expenses', 'daily']
  },
  {
    id: uuidv4(),
    title: 'Project Estimate',
    content: `Design: 20 hours x $30 = 600
Dev: 50 hours x $40 = 2000
QA: 15 hours x $25 = 375
Total: =600 + 2000 + 375

Client Budget: 4000
Remaining: =4000 - Total`,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    tags: ['work', 'estimate']
  },
  {
    id: uuidv4(),
    title: 'Budget Planning',
    content: `Monthly Income
Salary: 5000
Freelance: 1200
Total Income: =5000 + 1200

Monthly Expenses
Rent: 1500
Groceries: 600
Utilities: 200
Transport: 300
Entertainment: 400
Total Expenses: =1500 + 600 + 200 + 300 + 400

Savings: =@5 - @11
Savings Rate: =Savings / @5 * 100`,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    tags: ['budget', 'planning']
  },
  {
    id: uuidv4(),
    title: 'Shopping List with Tax',
    content: `rate = 45
hours = 36
tax = 0.10

Base Cost: =rate * hours
Tax Amount: =Base Cost * tax
Total Cost: =Base Cost + Tax Amount

Items:
- Laptop: 1200
- Mouse: 50
- Keyboard: 80
Subtotal: =1200 + 50 + 80
Tax: =Subtotal * 0.08
Final Total: =Subtotal + Tax`,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    tags: ['shopping', 'tax']
  }
];