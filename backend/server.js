// backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

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
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, passwordHash });
        await newUser.save();

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's tasks
app.get('/tasks', verifyToken, async (req, res) => {
    try {
        const userTasks = await Task.find({ userId: req.userId });
        res.json(userTasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add task
app.post('/tasks', verifyToken, async (req, res) => {
    const { text, category } = req.body;
    try {
        const newTask = new Task({ text, category, userId: req.userId });
        await newTask.save();
        res.json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task
app.put('/tasks/:id', verifyToken, async (req, res) => {
    const { text } = req.body;
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { text },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task
app.delete('/tasks/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!deleted) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
