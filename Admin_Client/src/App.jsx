import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import UsersManagement from './pages/UsersManagement'
import SkillsModeration from './pages/SkillsModeration'
import FeedbackPage from './pages/FeedbackPage'
import AnnouncementsPage from './pages/AnnouncementsPage'
import SwapMonitor from './pages/SwapMonitor'
import ReportsPage from './pages/ReportsPage'
import './App.css'

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/skills" element={<SkillsModeration />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/swaps" element={<SwapMonitor />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </AdminLayout>
  )
}

export default App
