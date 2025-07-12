import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import UserLayout from '../layouts/UserLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import OtherProfilePage from '../pages/OtherProfilePage';
import SwapRequestForm from '../pages/SwapRequestForm';
import SwapStatusPage from '../pages/SwapStatusPage';
import FriendsPage from '../pages/FriendsPage';
import GroupPage from '../pages/GroupPage';
import CreateGroupPage from '../pages/CreateGroupPage';
import GroupDetailPage from '../pages/GroupDetailPage';
import RecommendationPage from '../pages/RecommendationPage';
import MediaUploadPage from '../pages/MediaUploadPage';
import NotFound from '../pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const UserRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Protected routes with layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      }>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:userId" element={<OtherProfilePage />} />
        <Route path="swap-request" element={<SwapRequestForm />} />
        <Route path="swap-requests" element={<SwapStatusPage />} />
        <Route path="friends" element={<FriendsPage />} />
        <Route path="groups" element={<GroupPage />} />
        <Route path="groups/create" element={<CreateGroupPage />} />
        <Route path="groups/:groupId" element={<GroupDetailPage />} />
        <Route path="recommendations" element={<RecommendationPage />} />
        <Route path="upload" element={<MediaUploadPage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
