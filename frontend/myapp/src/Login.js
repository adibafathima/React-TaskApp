import React, { useState } from 'react';

const API_URL = 'http://localhost:5000';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    onLogin();
                } else {
                    setMessage(data.message);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            {message && <p className="error">{message}</p>}
        </div>
    );
}

export default Login;
