import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import UserRoutes from './routes/UserRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <UserRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
