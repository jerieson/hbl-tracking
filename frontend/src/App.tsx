import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CustomersPage } from './pages/CustomersPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<CustomersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;