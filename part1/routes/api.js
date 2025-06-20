var express = require('express');
var router = express.Router();
var db = require('../db'); // database

// /api/dogs
router.get('/dogs', async(req, res) => {
    try{
        await db.execute(`
            INSERT INTO dogs (name, size, owner_id)
            VALUES ('Max', 'medium', (SELECT user_id FROM Users WHERE username='alice123')),
            ('Bella', 'small', (SELECT user_id FROM Users WHERE username='carol123'))
            `);
    } catch (err) {
        console.error('Error ')
    }
})

// /api/walkrequests/open


// /api/walkers/summary


module.exports = router;