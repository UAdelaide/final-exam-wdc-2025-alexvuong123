var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var mysql = require('mysql2/promise');

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Set your MySQL root password
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS testdb');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    // Insert data if table is empty
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM books');
    if (rows[0].count === 0) {
      await db.execute(`
       INSERT INTO Users (username, email, password_hash, role)
       VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner'),
       ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
       ('carol123', 'carol@example.com', 'hashed789', 'owner'),
       ('alex246', 'alex@example.com', 'hashed246', 'walker'),
       ('johndoe', 'johndoe@example.com', 'hashed369', 'owner');

       INSERT INTO Dogs (user_id, name, size)
       VALUES ((SELECT user_id FROM Users WHERE username='alice123'), 'Max', 'medium'),
       ((SELECT user_id FROM Users WHERE username='carol123'), 'Bella', 'small'),
       ((SELECT user_id FROM Users WHERE username='johndoe'), 'Bob', 'large'),
       ((SELECT user_id FROM Users WHERE username='Joe345'), 'Kevin', 'small'),
       ((SELECT user_id FROM Users WHERE username='Steven'), 'Jason', 'medium');

       INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
       VALUES ((SELECT dog_id FROM Dog WHERE name='Max'), '2025-06-10 08:00:00', '30', 'Parklands', 'open'),
       ((SELECT dog_id FROM Dog WHERE name='Bella'), '2025-06-10 09:30:00', '45', 'Beachside Ave', 'accepted'),
       ((SELECT dog_id FROM Dog WHERE name='Bob'), '2025-06-10 10:15:00', '15', 'North Terrace', 'cancelled'),
       ((SELECT dog_id FROM Dog WHERE name='Kevin'), '2025-06-10 10:30:00', '30', 'King William St', 'completed'),
       ((SELECT dog_id FROM Dog WHERE name='Jason'), '2025-06-10 11:00:00', '20', 'Grenfell St', 'open');
      `);
    }
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

// /api/dogs
app.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT Dogs.name AS dog_name, Dogs.size, Users.username
      AS owner_username
      FROM Dogs
      JOIN Users ON Dogs.owner_id = Users.user_id
      `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// /api/walkrequests/open
app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT WalkRequests.requests_id, Dog.name AS dog_name, WalkRequests.request_time, WalkRequests.duration_minutes, WalkRequests.location, Users.username AS owner_username
      FROM WalkRequests
      JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
      JOIN Users ON Dog
      `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});


app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
