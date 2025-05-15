import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { currentUser } = useAuth();
  return (
    <div>
      <h1>Welcome to ExamPrepHUB!</h1>
      <p>Your one-stop solution for exam preparation.</p>
      {currentUser ? (
        <p>You are logged in as {currentUser.email}.</p>
      ) : (
        <p>Please log in or sign up to access all features.</p>
      )}
      {/* Add more content here */}
    </div>
  );
}

export default HomePage;
