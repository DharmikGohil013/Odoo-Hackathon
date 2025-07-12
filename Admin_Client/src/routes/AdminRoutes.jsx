import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminLayout from '../layouts/AdminLayout'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import UsersManagement from '../pages/UsersManagement'
import SkillsModeration from '../pages/SkillsModeration'
import FeedbackPage from '../pages/FeedbackPage'
import AnnouncementsPage from '../pages/AnnouncementsPage'
import SwapMonitor from '../pages/SwapMonitor'
import ReportsPage from '../pages/ReportsPage'
import GroupsManagement from '../pages/GroupsManagement'

const AdminRoutes = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/skills" element={<SkillsModeration />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/swaps" element={<SwapMonitor />} />
        <Route path="/groups" element={<GroupsManagement />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes