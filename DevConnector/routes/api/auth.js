const express = require('express');
const router = express.Router();

//@Routes Get api/auth
//@des test route
//@access Public
router.get('/', (req, res) => res.send('auth route'));

module.exports = router;