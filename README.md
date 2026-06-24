# Xpose — AI Career Gap Analyzer

Xpose is a full-stack AI-powered web application that analyzes your resume against a job description and tells you exactly why you might be getting rejected — before a recruiter ever sees it. It generates a readiness score, highlights skill gaps, and builds a personalized action plan to close them.

🔗 **Live Demo:** [xpose-three.vercel.app](https://xpose-three.vercel.app)
🔗 **Backend API:** [xpose-backend-q60k.onrender.com](https://xpose-backend-q60k.onrender.com)

---

## ✨ Features

- **Resume + Job Description Analysis** — Upload your resume and paste a job description to get an instant AI-powered comparison.
- **Readiness Score** — A clear, visual score showing how well your profile matches the role.
- **Skill Gap Reports** — See exactly which skills you have and which ones you're missing.
- **Proof-of-Work Verification** — Link your GitHub, LinkedIn, LeetCode, or portfolio to back up your claims across 8 different job categories (Web Dev, Backend, Frontend, Mobile, Data/ML, DevOps, QA, Product, Design).
- **Action Roadmap** — Personalized, prioritized steps to improve your readiness for the role.
- **Downloadable PDF Reports** — Export your full analysis report as a PDF.
- **Secure Authentication** — JWT-based login and signup to save and revisit your past reports.

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Recharts, jsPDF, html2canvas

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Authentication

**AI:** Groq AI API

**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## 📐 How It Works

1. **Upload your resume** — Xpose parses your PDF and extracts your skills and experience.
2. **Paste a job description** — The full job listing you're targeting.
3. **Pick your role + add proof** — Select a job category and link your GitHub, LinkedIn, or portfolio to verify your claims.
4. **AI analysis runs** — Groq AI compares your resume against the job description and your proof of work.
5. **Get your report** — A readiness score, skills matched/missing, gap severity breakdown, and a step-by-step action roadmap — downloadable as a PDF.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (or local MongoDB instance)
- A Groq API key ([console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/Bhoomiverma23/Xpose.git
cd Xpose
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Run the backend:
```bash
npm start
```

### 3. Set up the frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
Xpose/
├── backend/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── analysisRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   └── analysis.js
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SignupPage.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 🔮 Future Improvements

- Email verification on signup
- Support for more file formats (DOCX, plain text resumes)
- AI-powered resume rewriting suggestions
- Analytics dashboard for tracking readiness score improvements over time

---

## 📄 License

This project is open source and available for learning purposes.

---

## 👤 Author

**Bhoomi Verma**
[GitHub](https://github.com/Bhoomiverma23)
