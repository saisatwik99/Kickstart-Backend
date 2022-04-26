const express = require('express');
const router = express.Router();
const multer = require('../routes/multer');

const adminController = require('../controller/admin');

// Trending URL Get and Post Request
router.get('/trending', adminController.getTrending);
router.post('/trending', adminController.postTrending);
// Company URL Get and Post Request
router.get('/company', adminController.getCompany);
router.post('/company', multer.multerUploads, adminController.postCompany);
router.post('/company/delete', adminController.deleteCompany);
// Company Info URL Get
router.get('/companyInfo', adminController.getCompanyInfo);
// Contact URL Get and Post Request
router.get('/contact', adminController.getContact);
router.post('/contact', adminController.postContact);
// Pricing Testimonial URL Get and Post Request
router.get('/pricingTestinomial', adminController.getPricingTestinomial);
router.post('/pricingTestinomial', adminController.postPricingTestinomial);
// Blog URL Get and Post Request
router.get('/blog', adminController.getBlog);
router.post('/blog', multer.multerUploads, adminController.postBlog);
// Book URL Post Request
router.get('/book', adminController.getBook);
router.post('/book', adminController.postBook);
// Wishlist URL Get, Post and Delete Request
router.get('/wishlist', adminController.getWishlist);
router.post('/wishlist', adminController.postWishlist);
router.post('/wishlist/delete', adminController.deleteWishlist);

module.exports = router;