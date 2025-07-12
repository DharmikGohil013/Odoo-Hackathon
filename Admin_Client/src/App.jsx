import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getCurrentUser } from './store/slices/authSlice'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import UsersManagement from './pages/UsersManagement'
import SkillsModeration from './pages/SkillsModeration'
import FeedbackPage from './pages/FeedbackPage'
import AnnouncementsPage from './pages/AnnouncementsPage'
import SwapMonitor from './pages/SwapMonitor'
import ReportsPage from './pages/ReportsPage'
import GroupsManagement from './pages/GroupsManagement'
import ToastProvider from './components/ToastProvider'
import AuthDebug from './components/AuthDebug'
import { LoadingScreen } from './components/Loading'
import './App.css'

function App() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  // Initialize user on app load if token exists
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, isAuthenticated])

  if (loading) {
    return <LoadingScreen message="Initializing Admin Dashboard..." />
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthDebug />
        <LoginPage />
        <ToastProvider />
      </>
    )
  }

  return (
    <>
      <AuthDebug />
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/skills" element={<SkillsModeration />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/swaps" element={<SwapMonitor />} />
          <Route path="/groups" element={<GroupsManagement />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </AdminLayout>
      <ToastProvider />
    </>
  )
}

export default App
