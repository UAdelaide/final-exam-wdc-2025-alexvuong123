var express = require('express');
var router = express.Router();
var db = require('../db'); // database

// insert data

(async () => {
    try{
        // insert users
        await db.execute(`
            INSERT INTO Users (username, email, password_hash, role)
            VALUES('alice123', 'alice@example.com', 'hashed123', 'owner'),
            ('carol123', 'carol@example.com', 'hashed789', 'owner'),
            ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
            ('newwalker', 'newwalker@example.com', 'hashed000', 'walker')
            `);

        // insert sample for dogs
        await db.execute(`
            INSERT INTO Dogs (name, size, owner_id)
            VALUES ('Max', 'medium', (SELECT user_id FROM Users WHERE username='alice123')),
            ('Bella', 'small', (SELECT user_id FROM Users WHERE username='carol123'))
            `);

        // insert sample for open walk requests
        await db.execute(`
            INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
            VALUES ((SELECT dog_id FROM Dogs WHERE name='Max'), '2025-06-10T08:00:00.000Z', 30, 'Parklands', 'open')
            `);

        // insert sample for walkers summary
        await db.execute(`
            INSERT INTO WalkRatings(request_id, walker_id, owner_id, rating)
            VALUES (1, 2, 2),
            (2, 3, 4)
            `);
    } catch (err){
        console.error('Error', err);
    }
});

// /api/dogs
router.get('/dogs', async(req, res) => {

});

// /api/walkrequests/open
router.get('/walkrequests/open', async(req, res) => {

});

// /api/walkers/summary


module.exports = router;