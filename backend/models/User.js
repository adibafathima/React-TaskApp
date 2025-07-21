<<<<<<< HEAD
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
=======
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
>>>>>>> d232398a0cad84bf7169764329525b136a094b88
