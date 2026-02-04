import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { CustomersPage } from './pages/CustomersPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { authService } from './services/authService';
import './App.css';

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/customers" replace />
              ) : (
                <LoginPage />
              )
            } 
          />

          {/* Protected routes */}
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              <Navigate 
                to={isAuthenticated ? '/customers' : '/login'} 
                replace 
              />
            }
          />

          {/* 404 fallback */}
          <Route 
            path="*" 
            element={
              <Navigate 
                to={isAuthenticated ? '/customers' : '/login'} 
                replace 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;