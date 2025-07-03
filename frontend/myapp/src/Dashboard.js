import React from 'react';
import TaskList from './TaskList';

function Dashboard({ onLogout, API_URL }) {
    return (
        <div>
            <button className="logout-button" onClick={onLogout}>Logout</button>
            <TaskList API_URL={API_URL} />
        </div>
    );
}

export default Dashboard;
