import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import { AuthenticatedRoute, AdminRoute } from './components/Layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import QuestionPapersPage from './pages/QuestionPapersPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import UploadPaperPage from './pages/Admin/UploadPaperPage';
import NotFoundPage from './pages/NotFoundPage'; // Create this simple component

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Authenticated Routes */}
            <Route element={<AuthenticatedRoute />}>
              <Route path="/papers" element={<QuestionPapersPage />} />
              {/* Add more student-specific authenticated routes here */}
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/upload-paper" element={<UploadPaperPage />} />
              {/* Add more admin-specific routes here */}
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
