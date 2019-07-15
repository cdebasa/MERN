const express = require('express');
const router = express.Router();

//@Routes Get api/post
//@des test route
//@access Public
router.get('/', (req, res) => res.send('post route'));

module.exports = router;