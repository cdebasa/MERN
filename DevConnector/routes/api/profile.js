const express = require('express');
const router = express.Router();

//@Routes Get api/profile
//@des test route
//@access Public
router.get('/', (req, res) => res.send('profile route'));

module.exports = router;