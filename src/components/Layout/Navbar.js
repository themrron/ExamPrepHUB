import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const { currentUser, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav style={{ padding: '1rem', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/">ExamPrepHUB</Link>
      <div>
        <Link to="/papers" style={{ marginRight: '10px' }}>Papers</Link>
        {currentUser && userRole === 'admin' && (
          <Link to="/admin/dashboard" style={{ marginRight: '10px' }}>Admin Dashboard</Link>
        )}
        {currentUser ? (
          <>
            <span style={{ marginRight: '10px' }}>{currentUser.email} ({userRole})</span>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
