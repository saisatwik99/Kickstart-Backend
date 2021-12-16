const User =  require('../models/user');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if(!user)  return res.send('User not found');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.send('Incorrect password');

    
    const token = jwt.sign({_id: user._id, email: user.email}, process.env.TOKEN_SECRET);
    console.log(token);
    req.session.authtoken = token;
    res.send(token);
}

exports.signup = async (req, res, next) => {

    const { 
        firstName,
        lastName,
        email,
        password,
        phoneNumber
    } = req.body;

    const emailExist = await User.findOne({email});
    if(emailExist) return res.status(400).send('Email already exists');

    // Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        const result = await User.create({ 
            firstName, lastName, email, password: hashPassword,
            phoneNumber
        });
        res.send(result);
    }
    catch(err) {
        res.status(400).send(err);
    }
}
