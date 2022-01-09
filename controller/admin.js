const Trending = require('../models/trending');
const Product = require('../models/product');
const Contact = require('../models/contact');
const PricingTestinomial = require('../models/pricingTestinomials');
const Blog = require('../models/blog');
const Slot = require('../models/slot');
const Wishlist = require('../models/wishlist');
const { CourierClient } = require("@trycourier/courier");
const jwt = require('jsonwebtoken');
const Joi = require('joi');

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

exports.getTrending = async (req, res) => {
    const Trendings = await Trending.find();
    res.send(Object.values(Trendings));
}

exports.postTrending = async (req, res) => {
    const {
        imageSrc,
        type,
        pricePerDay,
        title,
        trendingText,
        durationText,
        locationText  
    } = req.body;
    try {
        const result = await Trending.create({ 
            imageSrc, type, pricePerDay, title, trendingText, durationText, locationText
        });
        res.send(result);
    }
    catch (err){
        res.status(400).send(err.message);
    }
}

exports.getProduct = async (req, res) => {
    var result = {Fintech: [], AI: [], Food: [], EdTech: []};
    result.Fintech = await Product.find({category: 'Fintech'});
    result.AI = await Product.find({category: 'AI'});
    result.Food = await Product.find({category: 'Food'});
    result.EdTech = await Product.find({category: 'EdTech'});
    res.send(result);
}

exports.postProduct = async (req, res) => {
    const {
        imageSrc, title, content1, content2, price, rating, reviews, category
    } = req.body;
    try {
        const result = await Product.create({ 
            imageSrc, title, content1, content2, price, rating, reviews, category
        });
        res.send(result);
    }
    catch (err){
        res.status(400).send(err.message);
    }
}

exports.getproductInfo = async (req, res) => {
    const { productId } = req.query;
    var info = await Product.findOne({_id: productId});
    if(!info) return res.send({message: "notFound"});
    info.content2 = info.content2.substring(9);
    res.send(info);
}

exports.getContact = async (req, res) => {
    const Contacts = await Contact.find();
    res.send(Object.values(Contacts));
}

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

exports.getPricingTestinomial = async (req, res) => {
    const PricingTestinomials = await PricingTestinomial.find();
    res.send(Object.values(PricingTestinomials));
}

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

exports.postBlog = async (req, res) => {
    
    try {
        const result = await Blog.create(req.body);
        res.send(result);
    }
    catch (err){
        res.status(400).send(err.message);
    }
}


exports.postBook = async (req, res) => {
    const { token } = req.body;
    const info = jwt.decode(token);
    const courier = CourierClient({ authorizationToken: "dk_prod_897CZS3S6K4NZBQSZ9YJ0SM1B3TH" });

    const { messageId } = await courier.send({
    brand: "AMXGFPJ304424AQRMYXJ0446Z60N",
    eventId: "6FD8Q8NE614BBWGNY71GEZ1860RT",
    recipientId: "517959ec-e210-4bf5-a749-ebc482fb5815",
    profile: {
        email: info.email,
    },
    data: {
    },
    override: {
    },
    });
    await Slot.create({
        userId: info._id, 
        email: info.email
    })
    res.send({ messageId, message: "We received your request. You will receive a mail shortly!" });
}

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

exports.postWishlist = async (req, res) => {
    const { productId, token } = req.body;
    const { _id, email } = jwt.decode(token);
    const userId = _id;
    const present = await Wishlist.findOne({userId, productId});
    if(present){
        return res.send({ message: "Already Wishlisted"});
    }
        
    const {
        imageSrc, title, content1, content2, price, rating, reviews, category
    } = await Product.findOne({_id: productId});
    try {
        const result = await Wishlist.create({ 
            userId, email, productId, imageSrc, title, content1, content2, price, rating, reviews, category
        });
        res.send({message: "Successfully Wishlisted the Startup!" }).status(200);
    }
    catch (err){
        res.status(400).send(err.message);
    }
}

exports.deleteWishlist = async (req, res) => {
    const { productId, token } = req.body;
    const { _id, email } = jwt.decode(token);
    const userId = _id;
    try {
        const result = await Wishlist.findOneAndDelete({userId, productId});
        
        res.send({ message: "Successfully deleted the Startup!" });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}