import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [showLogin, setShowLogin] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return (
            <div className="auth-container">
                {showLogin ? (
                    <>
                        <Login onLogin={() => setIsLoggedIn(true)} toggleMode={() => setShowLogin(false)} />
                        <p>Don’t have an account? <span onClick={() => setShowLogin(false)} className="auth-toggle">Register</span></p>
                    </>
                ) : (
                    <>
                        <Register toggleMode={() => setShowLogin(true)} />
                        <p>Already have an account? <span onClick={() => setShowLogin(true)} className="auth-toggle">Login</span></p>
                    </>
                )}
            </div>
        );
    }

    return <Dashboard onLogout={handleLogout} API_URL={API_URL} />;
}

export default App;
