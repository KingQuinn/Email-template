const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Initialize users.json if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Routes
app.post('/signup', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        // Read existing users
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        const users = JSON.parse(data);

        // Add new user
        const newUser = {
            name,
            email,
            signupDate: new Date().toISOString()
        };
        users.push(newUser);

        // Save back to file
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

        console.log(`User signed up: ${name} (${email})`);
        res.status(201).json({ message: 'Signup successful!' });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: 'Failed to save user data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Storing users in: ${USERS_FILE}`);
});
