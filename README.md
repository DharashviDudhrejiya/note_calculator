# Note Calculator 🧮📝

A smart notepad application that performs real-time inline calculations as you type. Combine the flexibility of a text editor with the power of a calculator.

![Note Calculator Demo](https://via.placeholder.com/800x400/FFD600/222222?text=Note+Calculator+Demo)

## ✨ Features

### 🧠 Core Functionality
- **Freeform notepad editor** with embedded expressions like `=3.50 + 7.80`
- **Real-time calculation engine** that recalculates results when inputs change
- **Line references** using `@1`, `@2`, etc. to reference previous calculations
- **Editable history** - changing one value automatically updates all dependent results

### 📝 Text Editor Features
- Rich text input with syntax highlighting
- Line numbering (optional)
- Auto-suggestions for functions and line references
- Indentation support for sub-categories

### 🔢 Calculation Features
- Standard math operations: `+`, `-`, `*`, `/`, `%`, `()`
- Built-in functions: `sum()`, `avg()`, `min()`, `max()`
- Variable support: `tax = 0.1` and reusable expressions
- Currency formatting and decimal precision control

### 🎨 UI/UX Features
- Beautiful light/dark theme toggle
- Minimalist design with floating cards
- Smooth animations and hover effects
- Responsive design for all devices
- Export options (PDF, CSV, Plain Text)

### 💾 Data Management
- Save notes with custom names
- Auto-save functionality
- Undo/redo history per note
- Search and tag functionality
- Export and sharing capabilities

### 🔐 Security & Privacy
- App-level passcode protection
- Local storage by default
- Optional cloud sync (ready for implementation)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (or use Docker)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd note-calculator
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

5. **Start MongoDB** (if not using Docker)
   ```bash
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173`

### Docker Development

1. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - MongoDB: `localhost:27017`

## 📖 Usage Examples

### Basic Calculations
```
Coffee: 3.50
Lunch: 8.20
Snacks: 2.30
Total: =3.50 + 8.20 + 2.30
```

### Using Variables
```
rate = 45
hours = 36
tax = 0.10

Base Cost: =rate * hours
Tax: =Base Cost * tax
Total: =Base Cost + Tax
```

### Line References
```
Item 1: 100
Item 2: 200
Item 3: 150
Subtotal: =@1 + @2 + @3
Tax (8%): =@4 * 0.08
Total: =@4 + @5
```

### Functions
```
Sales Data:
Q1: 15000
Q2: 18000
Q3: 22000
Q4: 19000

Average: =avg(@2, @3, @4, @5)
Total: =sum(@2:@5)
Best Quarter: =max(@2, @3, @4, @5)
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Math.js** for calculation engine
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers

### DevOps
- **Docker** & **Docker Compose**
- **Nginx** reverse proxy
- **ESLint** & **Prettier** for code quality

## 📁 Project Structure

```
note-calculator/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── Layout/             # Header, Sidebar components
│   │   ├── Editor/             # Note editor and export
│   │   └── Auth/               # Authentication components
│   ├── context/                # React Context for state management
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript type definitions
│   ├── styles/                 # CSS styles
│   └── data/                   # Seed data and constants
├── backend/                     # Backend source code
│   ├── models/                 # MongoDB models
│   ├── routes/                 # Express routes
│   ├── middleware/             # Custom middleware
│   └── utils/                  # Backend utilities
├── docker-compose.yml          # Docker services configuration
├── Dockerfile.frontend         # Frontend Docker configuration
└── README.md                   # This file
```

## 🧪 Testing

### Frontend Tests
```bash
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## 📦 Building for Production

### Frontend Build
```bash
npm run build
```

### Docker Production Build
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🚀 Deployment

### Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/note-calculator
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-domain.com
```

### Docker Deployment

1. **Build and start services**
   ```bash
   docker-compose up -d
   ```

2. **Check service status**
   ```bash
   docker-compose ps
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from [Dribbble](https://dribbble.com/shots/22648361-Financial-Calculator)
- Math.js library for calculation engine
- React and TypeScript communities
- MongoDB and Express.js teams

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-repo/note-calculator/issues) page
2. Create a new issue if your problem isn't already reported
3. Join our [Discord community](https://discord.gg/your-invite) for real-time help

---

**Made with ❤️ by the Note Calculator Team**## note_calculator
