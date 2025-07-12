import React from 'react';

const SimpleHomePage = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
        🎉 SkillSwap Platform is Working!
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '2rem' }}>
        Welcome to the Skill Exchange Platform
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>✅ Success!</h2>
        <p style={{ color: '#666' }}>
          The React application is successfully running and ready for development.
        </p>
        <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.9rem' }}>
          Port: 5176 | Status: Active
        </p>
      </div>
    </div>
  );
};

export default SimpleHomePage;
