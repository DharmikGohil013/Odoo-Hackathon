import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './components/Toast';
import UserRoutes from './routes/UserRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className=" bg-gray-50">
            <UserRoutes />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
