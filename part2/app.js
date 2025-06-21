const express = require('express');
var session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(session({
secret: ‘a’,
resave: false,
saveUninitialized: true,
cookie: { secure: false }
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;