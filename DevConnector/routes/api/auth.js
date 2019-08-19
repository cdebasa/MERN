const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); 
const User = require('../../models/User')

//@Routes Get api/auth
//@des test route
//@access Public{
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message); 
        req.status(500).send('Server Error');
    }
});
module.exports = router;