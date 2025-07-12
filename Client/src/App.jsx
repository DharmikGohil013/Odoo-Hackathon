import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import UserRoutes from './routes/UserRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Test banner to verify Tailwind CSS is working */}
          <div className="bg-red-500 text-white p-4 text-center font-bold">
            🎨 Tailwind CSS Test - If you see red background, CSS is working!
          </div>
          <UserRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
