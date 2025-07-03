import React, { useState } from 'react';

const API_URL = 'http://localhost:5000';

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
                    onRegister();
                } else {
                    setMessage(data.message);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
            {message && <p className="error">{message}</p>}
        </div>
    );
}

export default Register;
