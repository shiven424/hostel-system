import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WardenDashboard from './pages/WardenDashboard';
import PendingRequestsPage from './pages/PendingRequestsPage';
import ClosedRequestsPage from './pages/ClosedRequestsPage';
import PendingRoomRequests from './pages/PendingRoomRequests';
import ClosedRoomRequests from './pages/ClosedRoomRequests';
import FAQ from './pages/FAQ'; // Import the FAQ component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userLoggedIn'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');

  // Function to update login state based on local storage
  const updateLoginState = () => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(!!userLoggedIn);
    setUserRole(role || '');
  };

  // Only run on component mount
  useEffect(() => {
    updateLoginState();
    const handleStorageChange = () => updateLoginState();

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div>
        {/* Pass setIsLoggedIn and setUserRole to Navbar to enable logout */}
        <Navbar setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Public Routes */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to={`/${userRole}-dashboard`} /> : <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
          />
          <Route path="/register" element={<Register />} />

          {/* FAQ Route (Accessible to all) */}
          <Route path="/faq" element={<FAQ />} /> {/* Add FAQ route here */}
          
          {/* Protected Routes */}
          <Route
            path="/student-dashboard"
            element={isLoggedIn && userRole === 'student' ? <StudentDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-dashboard"
            element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/warden-dashboard"
            element={isLoggedIn && userRole === 'warden' ? <WardenDashboard /> : <Navigate to="/login" />}
          />
          
          {/* Admin-only routes for admin requests */}
          <Route
            path="/pending-requests"
            element={isLoggedIn && userRole === 'admin' ? <PendingRequestsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/closed-requests"
            element={isLoggedIn && userRole === 'admin' ? <ClosedRequestsPage /> : <Navigate to="/login" />}
          />

          {/* Warden-only routes for room requests */}
          <Route
            path="/pending-room-requests"
            element={isLoggedIn && userRole === 'warden' ? <PendingRoomRequests /> : <Navigate to="/login" />}
          />
          <Route
            path="/closed-room-requests"
            element={isLoggedIn && userRole === 'warden' ? <ClosedRoomRequests /> : <Navigate to="/login" />}
          />

          {/* Catch-all route to redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
