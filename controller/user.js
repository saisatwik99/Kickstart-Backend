const User =  require('../models/user');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string()
        .email().required()
        .messages({
            'string.empty': `Email should not be empty.`,
            'string.base': `Email should be a type of 'text'`,
            'any.required': `Email is a required!`,
            'string.email': `Email must be valid!`
        }),
    password: Joi.string().min(8).max(15).required()
    .messages({
        'string.empty': `Password should not be empty.`,
        'string.base': `Password should be a type of 'text'`,
        'string.max': `Password should have a maximum of 15 letters`,
        'string.min': `Password should have a minimum of 8 letters`,
        'any.required': `Password is a required!`
    })
})

const signupSchema = Joi.object({
    name: Joi.string().min(3).max(20).required()
        .messages({
            'string.empty': `Full Name should not be empty.`,
            'string.base': `Full Name should be a type of 'text'`,
            'string.max': `Full Name should have a maximum of 20 letters`,
            'string.min': `Full Name should have a minimum of 3 letters`,
            'any.required': `Full Name is a required!`
        }),
    email: Joi.string()
        .email().required()
        .messages({
            'string.empty': `Email should not be empty.`,
            'string.base': `Email should be a type of 'text'`,
            'any.required': `Email is a required!`,
            'string.email': `Email must be valid!`
        }),
    password: Joi.string().min(8).max(15).required()
    .messages({
        'string.empty': `Password should not be empty.`,
        'string.base': `Password should be a type of 'text'`,
        'string.max': `Password should have a maximum of 15 letters`,
        'string.min': `Password should have a minimum of 8 letters`,
        'any.required': `Password is a required!`
    }),
    phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required()
    .messages({
        'string.empty': `Phone Number should not be empty.`,
        'string.base': `Phone Number should be a type of 'text'`,
        'any.required': `Phone Number is a required!`,
        'string.length': `Phone Number must be 10 characters long!`,
        'string.pattern.base': `Phone Number is not valid!`
    })
})

exports.login = async (req, res, next) => {

    const { error, value } = loginSchema.validate(req.body);
    if(error) {
        return res.send({message: error.details[0].message});
    }

    const user = await User.findOne({ email: req.body.email });
    if(!user)  return res.send({message: 'Email not found'}).status(401);

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.send({message: 'Incorrect password'}).status(401);

    
    const token = jwt.sign({_id: user._id, email: user.email}, process.env.TOKEN_SECRET);
    console.log(token);
    req.session.authtoken = token;
    res.send({token}).status(201);
}

exports.signup = async (req, res, next) => {

    const { error, value } = signupSchema.validate(req.body);
    if(error){
        return res.send({message: error.details[0].message});
    }

    const { 
        name,
        email,
        password,
        phoneNumber
    } = req.body;

    const emailExist = await User.findOne({email});
    if(emailExist) return res.status(400).send({message: 'Email already exists'});

    // Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        const result = await User.create({ 
            name, email, password: hashPassword,
            phoneNumber
        });
        const token = jwt.sign({_id: result._id, email: result.email}, process.env.TOKEN_SECRET);
        res.send({token});
    }
    catch(err) {
        res.status(400).send(err);
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log("Successfully logged out");
        res.status(200);
    })
}
