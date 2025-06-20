var express = require('express');
var router = express.Router();
var db = require('../db'); // database

// /api/dogs
router.get('/dogs', async(req, res) => {
    try{
        const [rows] = await db.execute()
    }
})

// /api/walkrequests/open


// /api/walkers/summary


module.exports = router;