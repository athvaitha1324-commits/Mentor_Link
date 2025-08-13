# Mentor-Mentee App (React + Vite, Node.js + MongoDB)

Prereqs
- Node 18+
- MongoDB running (local or Atlas)

Backend
- cd backend
- cp .env.example .env
- Set MONGO_URI to your MongoDB (e.g., mongodb://127.0.0.1:27017/mentormentee or Atlas URI)
- npm install
- npm run dev

Frontend
- cd frontend
- cp .env.example .env
- set VITE_API_URL to backend URL (default http://localhost:5000/api)
- npm install
- npm run dev

Notes
- Google Drive uploads require service account credentials in backend .env
- Email reminders use SMTP creds
- Cron runs daily 8 PM server time by default