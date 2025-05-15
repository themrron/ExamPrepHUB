import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'student' or 'admin'

  async function fetchUserRole(uid) {
    if (!uid) return null;
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data().role || 'student'; // Default to student
      } else {
        // If user doc doesn't exist, create it (e.g., first login via Google)
        // For simplicity, we'll assign 'student' role by default here.
        // A more robust system might involve admin assigning roles or specific signup flows.
        await setDoc(userDocRef, { uid, email: auth.currentUser.email, role: 'student', createdAt: new Date() });
        return 'student';
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      return 'student'; // Fallback
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const role = await fetchUserRole(user.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signOut = () => {
    setUserRole(null); // Clear role on sign out
    return firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    userRole, // 'student', 'admin', or null
    loading,
    signOut,
    // You'll add login, signup functions here or in a separate authService.js
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
