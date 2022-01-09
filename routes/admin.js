const express = require('express');
const router = express.Router();

const adminController = require('../controller/admin');

// Trending URL Get and Post Request
router.get('/trending', adminController.getTrending);
router.post('/trending', adminController.postTrending);
// Product URL Get and Post Request
router.get('/product', adminController.getProduct);
router.post('/product', adminController.postProduct);
// Product Info URL Get
router.get('/productInfo', adminController.getproductInfo);
// Contact URL Get and Post Request
router.get('/contact', adminController.getContact);
router.post('/contact', adminController.postContact);
// Pricing Testimonial URL Get and Post Request
router.get('/pricingTestinomial', adminController.getPricingTestinomial);
router.post('/pricingTestinomial', adminController.postPricingTestinomial);
// Blog URL Get and Post Request
router.get('/blog', adminController.getBlog);
router.post('/blog', adminController.postBlog);
// Book URL Post Request
router.post('/book', adminController.postBook);
// Wishlist URL Get, Post and Delete Request
router.get('/wishlist', adminController.getWishlist);
router.post('/wishlist', adminController.postWishlist);
router.post('/wishlist/delete', adminController.deleteWishlist);

module.exports = router;