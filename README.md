# FinPath - Navigate Your Financial Future

**FinPath** is a comprehensive financial literacy platform that empowers users to master their money game through personalized roadmaps, asset/liability tracking, and goal-oriented financial planning.

## 🌐 Live Demo

- **Frontend Application**: [https://finpath-app-iota.vercel.app](https://finpath-app-iota.vercel.app)
- **Backend API**: [https://finpath-app.onrender.com](https://finpath-app.onrender.com)
- **Pitch Deck**: [https://www.canva.com/design/DAG5AeyekYE/Dr9NO27St7csSmwFzZ2r3g/edit?utm_content=DAG5AeyekYE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton](./pitch-deck/FinPath-Pitch-Deck.pdf)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [SDG Alignment](#sdg-alignment)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About the Project

FinPath addresses a critical gap in financial literacy by providing users with:

1. **Asset vs. Liability Understanding** - Learn what builds wealth versus what drains it
2. **Personalized Financial Roadmaps** - Get customized action plans based on your situation
3. **Goal-Oriented Planning** - Set and track up to 3 financial goals
4. **Real-Time Tracking** - Monitor your net worth and financial health

### The Problem

Most people struggle with:
- Understanding how money really works
- Distinguishing between assets and liabilities
- Creating actionable financial plans
- Tracking progress toward financial goals

### Our Solution

FinPath uses an intelligent algorithm to:
- Analyze your financial situation
- Consider your employment status and goals
- Generate a prioritized roadmap with actionable steps
- Track progress and adapt as you grow

---

## ✨ Key Features

### 🏦 Financial Items Management
- Track assets (savings, investments, business, retirement accounts)
- Monitor liabilities (credit cards, loans, debts)
- Calculate net worth and asset-to-liability ratios
- Visual categorization with real-time summaries

### 🎯 Goal Setting
- Set up to 3 prioritized financial goals
- Choose from 6 goal types:
  - Build Emergency Fund
  - Get Out of Debt
  - Start Investing
  - Start a Business
  - Retire Early
  - Generate Passive Income
- Track goal status (Not Started, In Progress, Completed)

### 🗺️ Personalized Roadmap
- Algorithm-generated action plans
- Priority-based step ordering
- Category-specific guidance (Foundation, Wealth-Building, Advanced)
- Progress tracking with visual indicators
- Parallel task execution support

### 💰 Currency Support
- Full KES (Kenyan Shillings) support
- Proper thousand separators and formatting
- Consistent currency display across all pages

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing (bcrypt)
- Protected routes and API endpoints
- User-specific data isolation

---

## 🛠️ Tech Stack

### Frontend
- **React** (v18.2.0) - UI framework
- **React Router** (v6.10.0) - Navigation
- **Tailwind CSS** (v3.4.0) - Styling
- **Axios** - HTTP client
- **Recharts** (v2.5.0) - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express** (v4.18.2) - Web framework
- **MongoDB** - Database
- **Mongoose** (v7.0.0) - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 🌍 SDG Alignment

**Primary SDG: SDG 1 - No Poverty**

FinPath contributes to poverty reduction through:
- **Financial Literacy Education** - Teaching users about assets, liabilities, and wealth building
- **Accessible Financial Tools** - Free platform available to anyone with internet access
- **Personalized Guidance** - Tailored roadmaps based on individual circumstances
- **Empowerment** - Helping users make informed financial decisions

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/finpath-app.git
cd finpath-app
```

2. **Setup Backend**
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Add your environment variables to .env:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# NODE_ENV=development
```

3. **Setup Frontend**
```bash
cd ../client
npm install

# Create .env file
cp .env.example .env

# Add your environment variables to .env:
# REACT_APP_API_URL=http://localhost:5000
```

4. **Run the Application**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 📁 Project Structure

```
finpath-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions (roadmap algorithm)
│   ├── server.js         # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📡 API Documentation

### Authentication Endpoints

**POST** `/api/auth/register`
- Register new user
- Body: `{ name, email, password }`

**POST** `/api/auth/login`
- Login user
- Body: `{ email, password }`

**GET** `/api/auth/me`
- Get current user (Protected)
- Headers: `Authorization: Bearer <token>`

### Financial Items Endpoints

**GET** `/api/financial-items` - Get all items (Protected)

**POST** `/api/financial-items` - Create item (Protected)

**PUT** `/api/financial-items/:id` - Update item (Protected)

**DELETE** `/api/financial-items/:id` - Delete item (Protected)

### Goals Endpoints

**GET** `/api/goals` - Get all goals (Protected)

**POST** `/api/goals` - Create goal (Protected)

**PUT** `/api/goals/:id` - Update goal (Protected)

**DELETE** `/api/goals/:id` - Delete goal (Protected)

### Roadmap Endpoints

**GET** `/api/roadmap` - Get roadmap (Protected)

**POST** `/api/roadmap/generate` - Generate roadmap (Protected)

**PUT** `/api/roadmap/progress/:stepNumber` - Update progress (Protected)

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Set root directory to `client`
4. Add environment variable: `REACT_APP_API_URL`
5. Deploy

### Backend (Render)

1. Create Web Service on Render
2. Connect GitHub repository
3. Set root directory to `server`
4. Add environment variables (PORT, MONGO_URI, JWT_SECRET, NODE_ENV)
5. Deploy

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Configure network access (0.0.0.0/0 for production)
3. Get connection string
4. Add to backend environment variables

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Contact

**Collins Otinga** - [collinsoting@gmail.com]
**Project Link**: [https://github.com/OtingaC/finpath-app.git]
**Live Demo**: [https://finpath-app-iota.vercel.app]

---

## 🙏 Acknowledgments

- Inspired by the need for accessible financial education
- Built as a final project for PLP
- Special thanks to mentors and peers for feedback and support

---

## 📊 Project Status

✅ MVP Complete  
✅ Deployed to Production  
🚧 Future Enhancements:
- AI-powered financial advice
- Mobile app (React Native)
- Multi-currency support
- Community features and forums
- Financial news integration

---

**Made with ❤️ for financial empowerment**