import React, { useState } from 'react';

const API_URL = 'https://react-taskapp.onrender.com';

function Register({ onRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'User registered successfully') {
                    setMessage('Registered successfully! Please login.');
                    setUsername('');
                    setPassword('');
                    setTimeout(() => {
                        onRegister(); // Switch to Login form after success
                    }, 1000);
                } else {
                    setMessage(data.message);
                }
            })
            .catch(err => {
                console.error('Error during registration:', err);
                setMessage('An error occurred. Please try again.');
            });
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Register</button>
            </form>
            {message && <p className="error">{message}</p>}
        </div>
    );
}

export default Register;
