const express = require('express'); 
const router = express.Router();
const { check, validationResult} = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');

//Destructure

//@Routes Get api/users
//@des test route
//@access Public
router.post('/', 
[
//check if not empty
//.not and isempty make sure name is not empty
check('name', 'Name is required').not().isEmpty(),
//check for email
check('email', 'please include a valid email').isEmail(),
//check for password
check('password', 'Password needs to be 6 characters long').isLength({min: 6})

],

async (req, res) => 
{
    //check to see if there are errors
    const errors = validationResult(req);
    // there is send the response
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body; 

    try {
    //see if the user exists
    // 1. grab user 
    let user = await User.findOne({email});
        //if user exists send back error
    if(user){
        res.status('400').json({errors: [{msg: 'email already taken'}]})
    }  
    //get user gravitar
        //put that part of the user
    const avatar = gravatar.url(email, {
        s: '200', 
        r: 'pg', 
        d: 'mm'
    });

    //create the user
    user = new User({
        name, 
        email, 
        password, 
        avatar,
    });
    //encrypt password beore saving
        //using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
        user:{
            id: user.id
        }
    };
    jwt.sign(
        payload, 
        config.get('jwtSecret'), 
        {expiresIn: 360000}, 
        (err, token) =>{
            if (err) throw err; 
            res.json({ token });
        }
    );
    //return jsonwebtoken
        //when user registers I want them to get logged in rightaway
        //in order to be logged in gotta have that token


    } catch (err) {
        console.error(err.message);
        //500 internal server error
        res.status(500).send('server error');
    }
   

}
);

module.exports = router; 