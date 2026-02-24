import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppSelector';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';

const App: React.FC = () => {
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
