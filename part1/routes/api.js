var express = require('express');
var router = express.Router();
var db = require('../db'); // database

let db;

(async () => {
    try{
         await db.execute(`
            INSERT INTO dogs (name, size, owner_id)
            VALUES ('Max', 'medium', (SELECT user_id FROM Users WHERE username='alice123')),
            ('Bella', 'small', (SELECT user_id FROM Users WHERE username='carol123'))
            `);
    }
});

// /api/dogs
router.get('/dogs', async(req, res) => {
    try{

    } catch (err) {
        console.error('Error', err);
    }
});

// /api/walkrequests/open
router.get('/walkrequest/open', async(req, res) => {

});

// /api/walkers/summary


module.exports = router;