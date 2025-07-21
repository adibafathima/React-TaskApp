import React, { useState, useEffect } from 'react';

function TaskList({ API_URL }) {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [category, setCategory] = useState('All');
    const [filter, setFilter] = useState('All');

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': token }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTasks(data);
                } else {
                    console.error("Unexpected response:", data);
                    setTasks([]);
                }
            })
            .catch(err => {
                console.error("Error fetching tasks:", err);
                setTasks([]);
            });
    }, [API_URL, token]);

    const handleAddTask = () => {
        if (input.trim() !== '') {
            fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
                body: JSON.stringify({ text: input, category: category })
            })
                .then(res => res.json())
                .then(newTask => setTasks([...tasks, newTask]))
                .catch(err => console.error("Error adding task:", err));

            setInput('');
        }
    };

    const handleDeleteTask = (id) => {
        fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        })
            .then(() => setTasks(tasks.filter(task => task._id !== id)))
            .catch(err => console.error("Error deleting task:", err));
    };

    const handleEditTask = (id, newText) => {
        fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify({ text: newText })
        })
            .then(res => res.json())
            .then(() => {
                const updatedTasks = tasks.map(task =>
                    task._id === id ? { ...task, text: newText } : task
                );
                setTasks(updatedTasks);
            })
            .catch(err => console.error("Error editing task:", err));
    };

    const categories = ['All', 'Personal', 'Work', 'Shopping', 'Others'];
    const filteredTasks = Array.isArray(tasks)
        ? (filter === 'All' ? tasks : tasks.filter(task => task.category === filter))
        : [];

    return (
        <div className="app">
            <h1 className="app-title">My Task List</h1>

            <div className="input-section">
                <input
                    className="task-input"
                    type="text"
                    placeholder="Enter a task"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <select className="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Others">Others</option>
                </select>
                <button className="add-button" onClick={handleAddTask}>Add Task</button>
                <button className="print-button" onClick={() => window.print()}>Print Task List</button>
            </div>

            <div className="filter-section">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={filter === cat ? 'filter-button active' : 'filter-button'}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <ul className="task-list">
                {Array.isArray(filteredTasks) && filteredTasks.map((task) => (
                    <li className="task-item" key={task._id}>
                        <span className="task-text">{task.text}</span>
                        <span className="task-category">{task.category}</span>
                        <div className="task-buttons">
                            <button className="delete-button" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                            <button className="edit-button" onClick={() => {
                                const newText = prompt('Enter new task text:', task.text);
                                if (newText) handleEditTask(task._id, newText);
                            }}>Edit</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;
