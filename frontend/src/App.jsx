import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import RegisterMentor from './pages/RegisterMentor.jsx';
import RegisterMentee from './pages/RegisterMentee.jsx';
import RegisterHOD from './pages/RegisterHOD.jsx';
import MentorDashboard from './pages/MentorDashboard.jsx';
import MenteeDashboard from './pages/MenteeDashboard.jsx';
import HodDashboard from './pages/HodDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/mentor" element={<RegisterMentor />} />
      <Route path="/register/mentee" element={<RegisterMentee />} />
      <Route path="/register/hod" element={<RegisterHOD />} />

      <Route element={<ProtectedRoute roles={["mentor"]} />}> 
        <Route path="/dashboard/mentor" element={<MentorDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={["mentee"]} />}> 
        <Route path="/dashboard/mentee" element={<MenteeDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={["hod"]} />}> 
        <Route path="/dashboard/hod" element={<HodDashboard />} />
      </Route>
    </Routes>
  );
}
