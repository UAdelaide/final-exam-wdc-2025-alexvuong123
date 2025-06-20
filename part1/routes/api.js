var express = require('express');
var router = express.Router();
var db = require('../db'); // database

// insert data
let db;

(async () => {
    try{
        // insert users
        await db.execute(`
            INSERT INTO Users (username, email, password_hash, role)
            `)

        // insert sample for dogs
         await db.execute(`
            INSERT INTO Dogs (name, size, owner_id)
            VALUES ('Max', 'medium', (SELECT user_id FROM Users WHERE username='alice123')),
            ('Bella', 'small', (SELECT user_id FROM Users WHERE username='carol123'))
            `);
        // insert sample for open walk requests
         await db.execute(`
            INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, owner_id)

            `)
    } catch (err){
        console.error('Error', err);
    }
});

// /api/dogs
router.get('/dogs', async(req, res) => {

});

// /api/walkrequests/open
router.get('/walkrequest/open', async(req, res) => {

});

// /api/walkers/summary


module.exports = router;