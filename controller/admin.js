const Trending = require('../models/trending');
const Product = require('../models/product');
const Contact = require('../models/contact');
const PricingTestinomial = require('../models/pricingTestinomials');
const Blog = require('../models/blog');
const Slot = require('../models/slot');
const Wishlist = require('../models/wishlist');
const { CourierClient } = require("@trycourier/courier");
const jwt = require('jsonwebtoken');


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

exports.getContact = async (req, res) => {
    const Contacts = await Contact.find();
    res.send(Object.values(Contacts));
}

exports.postContact = async (req, res) => {
    const {
        email, fullName, subject, message
    } = req.body;
    try {
        const result = await Contact.create({ 
            email, fullName, subject, message
        });
        res.send(result);
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
    const Blogs = await Blog.find();
    res.send(Object.values(Blogs));
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
    res.send(messageId);
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
        return res.send("Already Wishlisted");
    }
        
    const {
        imageSrc, title, content1, content2, price, rating, reviews, category
    } = await Product.findOne({_id: productId});
    try {
        const result = await Wishlist.create({ 
            userId, email, productId, imageSrc, title, content1, content2, price, rating, reviews, category
        });
        res.send(result);
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
        res.send(result);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}