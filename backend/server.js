const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey'; 



app.use(cors());
app.use(express.json());

let users = []; // [{ id, username, passwordHash }]
let tasks = [];
let idCounter = 1;

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
}

// Register new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find(user => user.username === username);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, passwordHash };
    users.push(newUser);

    res.json({ message: 'User registered successfully' });
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Protected: Get user's tasks
app.get('/tasks', verifyToken, (req, res) => {
    const userTasks = tasks.filter(task => task.userId === req.userId);
    res.json(userTasks);
});

// Protected: Add task
app.post('/tasks', verifyToken, (req, res) => {
    const { text, category } = req.body;
    const newTask = { id: idCounter++, text, category, userId: req.userId };
    tasks.push(newTask);
    res.json(newTask);
});

// Protected: Update task
app.put('/tasks/:id', verifyToken, (req, res) => {
    const taskId = parseInt(req.params.id);
    const { text } = req.body;
    const task = tasks.find(t => t.id === taskId && t.userId === req.userId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.text = text;
    res.json(task);
});

// Protected: Delete task
app.delete('/tasks/:id', verifyToken, (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.userId);
    if (taskIndex === -1) return res.status(404).json({ message: 'Task not found' });

    tasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
