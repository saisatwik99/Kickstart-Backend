const Trending = require('../models/trending');
const Company = require('../models/company');
const Contact = require('../models/contact');
const PricingTestinomial = require('../models/pricingTestinomials');
const Blog = require('../models/blog');
const Slot = require('../models/slot');
const Wishlist = require('../models/wishlist');
const { CourierClient } = require("@trycourier/courier");
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const cloudinary = require('../config/cloudinaryConfig');
const client = require('../config/redis.js');

// const REDIS_URL = "redis://127.0.0.1.6379";
// const client = redis.createClient(REDIS_URL);

// Contact Schema Validation
const contactSchema = Joi.object({
    email: Joi.string()
        .email().required()
        .messages({
            'string.empty': `Email should not be empty.`,
            'string.base': `Email should be a type of 'text'`,
            'any.required': `Email is a required!`,
            'string.email': `Email must be valid!`
        }),
    fullName: Joi.string().min(3).max(20).required()
        .messages({
            'string.empty': `Full Name should not be empty.`,
            'string.base': `Full Name should be a type of 'text'`,
            'string.max': `Full Name should have a maximum of 20 letters`,
            'string.min': `Full Name should have a minimum of 3 letters`,
            'any.required': `Full Name is a required!`
        }),
    subject: Joi.string().min(8).max(25).required()
        .messages({
            'string.empty': `Subject should not be empty.`,
            'string.base': `Subject should be a type of 'text'`,
            'string.max': `Subject should have a maximum of 25 letters`,
            'string.min': `Subject should have a minimum of 8 letters`,
            'any.required': `Subject is a required!`
        }),
    message: Joi.string().min(8).max(300).required()
        .messages({
            'string.empty': `Message should not be empty.`,
            'string.base': `Message should be a type of 'text'`,
            'string.max': `Message should have a maximum of 300 letters`,
            'string.min': `Message should have a minimum of 8 letters`,
            'any.required': `Message is a required!`
        }),
})

// Get Trending Items
exports.getTrending = async (req, res) => {
    const trending = await client.get("trending", (err, data) => {
        if(err) throw err;
        if(data !== null) {
            return data;
        }
    });
    if(trending == null) {
        const Trendings = await Trending.find();
        await client.set("trending", JSON.stringify(Trendings));
        return res.send(Trendings);
    } else {
        return res.send(JSON.parse(trending));
    }
}

// Post Trending Items 
exports.postTrending = async (req, res) => {
    const {
        image,
        name,
        price,
        type,
        trendingText,
        soldTime,
        location  
    } = req.body;
    try {
        const result = await Trending.create({ 
            image, name, price, type, trendingText, soldTime, location 
        });
        await client.del("trendings");
        res.send(result);
    }
    catch (err){
        res.status(400).send(err.message);
    }
}

// Get Company Items
exports.getCompany = async (req, res) => {

    // await redis.connect();
    const companies = await client.get("company", (err, data) => {
        if(err) throw err;
        if(data !== null) {
            console.log("I am inside redis");
            return data;
        }
    });
    if(companies == null) {
        var result = {Fintech: [], AI: [], Food: [], EdTech: []};
        result.Fintech = await Company.find({category: 'Fintech'});
        result.AI = await Company.find({category: 'AI'});
        result.Food = await Company.find({category: 'Food'});
        result.EdTech = await Company.find({category: 'EdTech'});
        await client.set("company", JSON.stringify(result));
        console.log("Data fetched from DB");
        return res.json(result);
    } else {
        console.log("Data fetched from Redis");
        return res.send(JSON.parse(companies));
    }
    
}

// Post Company Items
exports.postCompany = async (req, res) => {
    const imgResult = await cloudinary.uploader.upload(req.file.path);
    const {
        title, content1, content2, price, rating, reviews, category
    } = req.body;
    try {
        const result = await Company.create({ 
            imageSrc: imgResult.url, title, content1, content2, price, rating, reviews, category
        });
        await client.del("company");
        res.send(result);
    }

    catch (err){
        res.status(400).send(err.message);
    }
}

exports.deleteCompany = async (req, res) => {
    const { companyId } = req.body;
    try {
        const result = await Company.findOneAndDelete({_id: companyId});
        
        res.send({ message: "Successfully deleted the Startup!" });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

// Get Complete Company Info by Company ID
exports.getCompanyInfo = async (req, res) => {
    const { companyId } = req.query;
    var info = await Company.findOne({_id: companyId});
    if(!info) return res.send({error: 400});
    info.content2 = info.content2.substring(9);
    res.send(info);
}

// Get all contact details
exports.getContact = async (req, res) => {
    const Contacts = await Contact.find();
    res.send(Object.values(Contacts));
}

// Post Contact Details
exports.postContact = async (req, res) => {

    const { error, value } = contactSchema.validate(req.body);
    if(error) {
        return res.send({message: error.details[0].message, red: 1});
    }

    const {
        email, fullName, subject, message
    } = req.body;
    try {
        const result = await Contact.create({ 
            email, fullName, subject, message
        });
        res.send({ data: result, message: "We received your request. Our team will contact you shortly!", red: 0});
    }
    catch (err){
        res.status(400).send(err.message);
    }
}

// Get Testinomial
exports.getPricingTestinomial = async (req, res) => {
    const PricingTestinomials = await PricingTestinomial.find();
    res.send(Object.values(PricingTestinomials));
}

// Post Testinomials
exports.postPricingTestinomial = async (req, res) => {
    const {
        imageSrc, quote, customerName
    } = req.body;
    try {
        const result = await PricingTestinomial.create({ 
            imageSrc, quote, customerName
        });
        res.send(result);
    }
    catch (err){
        res.status(400).send(err.message);
    }
}

// Get all Blog
exports.getBlog = async (req, res) => {
    const { pageNum, pageSize } = req.query;
    if(pageNum === undefined || pageSize === undefined || pageNum < 1){
        const Items = await Blog.find();
        return res.send(Items);
    }
    const skipNo = (pageNum-1)*pageSize;
    const totalNumber = await Blog.count();
    const Blogs = await Blog.find().skip(parseInt(skipNo)).limit(parseInt(pageSize));
    let Pagination = { 
        currentPage: pageNum,
        pageSize: pageSize,
        totalRecords: totalNumber,
        totalPages: Math.ceil(totalNumber/pageSize)
    }
    var result = { data: Blogs, Pagination }
    res.send(result);
}

// Post Blogs
exports.postBlog = async (req, res) => {
    const imgResult = await cloudinary.uploader.upload(req.file.path);
    const info = req.body;
    info.postImageSrc = imgResult.url;
    try {
        const result = await Blog.create(info);
        res.send(result);
    }
    catch (err){
        res.status(400).send(err.message);
    }
}

// Get all Bookings
exports.getBook = async (req, res) => {
    const Bookings = await Slot.find();
    res.send(Bookings);
}

// Book a Service
exports.postBook = async (req, res) => {
    const { token } = req.body;
    console.log(req.body);
    if(req.body.name === undefined || req.body.hour === undefined || req.body.min === undefined || req.body.ampm === undefined || req.body.date === undefined)
        return res.send({ message: "Please fill all the fields!", red: 1});
    if((req.body.hour < 8 || req.body.hour == 12) && req.body.ampm == 0 )
        return res.send({ message: "We are available bewteen 8:00AM to 8:00PM. Please select other time!", red: 1});
        if((req.body.hour > 8 || req.body.hour == 12) && req.body.ampm == 1 )
        return res.send({ message: "We are available bewteen 8:00AM to 8:00PM. Please select other time!", red: 1});
    const info = jwt.decode(token);
    const courier = CourierClient({ authorizationToken: "pk_prod_3J3MVG89KD4R68NB3V2PJSKYPCXB" });
    const ampm = 'AM';
    if (req.body.ampm == 1)
        ampm = 'PM';
    const time = `${req.body.hour}:${req.body.min} ${ampm}`
    const { messageId } = await courier.send({
    eventId: "8RBEVBVP7YMMPPK57A8C2912NNND",
    recipientId: "9af5f0b8-c7b5-40a0-ace3-2c516861ceb5",
    profile: {
        email: info.email,
    },
    data: {
        date: req.body.date,
        time: time
    },
    override: {
    },
    });
    console.log(req.body.date);
    console.log(time);
    await Slot.create({
        userId: info._id, 
        email: info.email,
        date: req.body.date,
        time,
        name: req.body.name
    })
    res.send({ messageId, message: "We received your request. You will receive a mail shortly!" });
}

// Get Wishlisted Startups bu User ID
exports.getWishlist = async (req, res) => {
    const { token } = req.query;
    const info = jwt.decode(token);
    const userId = info._id;
    var result = {Fintech: [], AI: [], Food: [], EdTech: []};
    result.Fintech = await Wishlist.find({userId, category: 'Fintech'});
    result.AI = await Wishlist.find({userId, category: 'AI'});
    result.Food = await Wishlist.find({userId, category: 'Food'});
    result.EdTech = await Wishlist.find({userId, category: 'EdTech'});
    res.send(result);
}

// Post Wishlisted Startup
exports.postWishlist = async (req, res) => {
    const { companyId, token } = req.body;
    const { _id, email } = jwt.decode(token);
    const userId = _id;
    const present = await Wishlist.findOne({userId, companyId});
    if(present){
        return res.send({ message: "Already Wishlisted"});
    }
        
    const {
        imageSrc, title, content1, content2, price, rating, reviews, category
    } = await Company.findOne({_id: companyId});
    try {
        const result = await Wishlist.create({ 
            userId, email, companyId, imageSrc, title, content1, content2, price, rating, reviews, category
        });
        res.send({message: "Successfully Wishlisted the Startup!" }).status(200);
    }
    catch (err){
        res.status(400).send(err.message);
    }
}

// Delete a Wishlisted Startup
exports.deleteWishlist = async (req, res) => {
    const { companyId, token } = req.body;
    const { _id, email } = jwt.decode(token);
    const userId = _id;
    try {
        const result = await Wishlist.findOneAndDelete({userId, companyId});
        if(result)
            return res.send({ message: "Successfully deleted the Startup!" });
        else
            return res.status(400).send("Unable to find the company in Wishlist");
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}