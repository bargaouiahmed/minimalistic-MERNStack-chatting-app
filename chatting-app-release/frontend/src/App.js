import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { Form } from './components/loginPage.js';
import { CreateUser } from './components/createUser.js';
import { ChatInterface } from './components/chatInterface.js'; // Capitalized ChatInterface
import { AuthorizedContext } from './index.js';

function Navigation() {
  const location = useLocation();

  return (
    <div>
      {location.pathname === '/' && (
        <Link to="/register" style={{ margin: '48vw ' }} className='bg-slate-500 p-2 text-red-500 rounded-lg'>Register</Link>
      )}
      {location.pathname === '/register' && (
        <Link to="/" style={{ margin: ' 48vw ' }} className='bg-slate-500 px-3 py-2  text-red-500 rounded-lg'>Login</Link>
      )}
    </div>
  );
}

function ProtectedRoute({ element }) {
  const { isAuthed } = useContext(AuthorizedContext);

  return isAuthed ? element : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/register" element={<CreateUser />} />
        <Route path="/chat" element={<ProtectedRoute element={<ChatInterface />} />} />
      </Routes>
      <Navigation />
    </Router>
  );
}

export default App;
