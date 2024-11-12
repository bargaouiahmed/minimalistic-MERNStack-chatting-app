import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

export const AuthorizedContext = React.createContext(false);

const RootComponent = () => {
  const [isAuthed, setIsAuthed] = useState(() => {
    // Check localStorage for auth state on initial load
    return localStorage.getItem('isAuthed') === 'true';
  });

  useEffect(() => {
    // Update localStorage whenever isAuthed changes
    localStorage.setItem('isAuthed', isAuthed.toString());
  }, [isAuthed]);

  return (
    <AuthorizedContext.Provider value={{ isAuthed, setIsAuthed }}>
      <App />
    </AuthorizedContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
