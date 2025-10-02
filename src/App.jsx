import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Authentication/Login'
import Register from './pages/Authentication/Register'
import RequireAuth from './components/RequireAuth'
import InterviewerLayout from './layouts/InterviewerLayout'
import IntervieweeLayout from './layouts/IntervieweeLayout'
import InterviewerDashboard from './pages/Interviewer/Dashboard'
import IntervieweeDashboard from './pages/Interviewee/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

  <Route path="/interviewer/*" element={<RequireAuth allowedRole="interviewer"><InterviewerLayout><InterviewerDashboard /></InterviewerLayout></RequireAuth>} />
  <Route path="/interviewee/*" element={<RequireAuth allowedRole="interviewee"><IntervieweeLayout><IntervieweeDashboard /></IntervieweeLayout></RequireAuth>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
