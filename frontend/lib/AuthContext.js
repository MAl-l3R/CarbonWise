// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log('User logged in:', user);
        setLoading(true);

        const userDocRef = doc(db, 'accounts', user.uid);

        // Set up a listener for the Firestore user document to prevent race condition errors
        unsubscribeUserDoc = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              // console.log('Firestore user data:', docSnapshot.data());
              setCurrentUser({ uid: user.uid, email: user.email, ...docSnapshot.data() });
            } else {
              console.log('No Firestore document found for user:', user.uid);
              // Keep currentUser as null until the document exists
              setCurrentUser(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching user document:', error);
            setCurrentUser(null);
            setLoading(false);
          }
        );
      } else {
        console.log('No user is logged in');
        setCurrentUser(null);
        setLoading(false);
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc(); // Unsubscribe from userDoc listener if any
        }
      }
    });

    // Clean up listeners on unmount
    return () => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
      unsubscribeAuth();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
