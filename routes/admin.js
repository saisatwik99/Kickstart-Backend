const express = require('express');
const router = express.Router();

const adminController = require('../controller/admin');

router.get('/trending', adminController.getTrending);
router.post('/trending', adminController.postTrending);
router.get('/product', adminController.getProduct);
router.post('/product', adminController.postProduct);
router.get('/productInfo', adminController.getproductInfo);
router.get('/contact', adminController.getContact);
router.post('/contact', adminController.postContact);
router.get('/pricingTestinomial', adminController.getPricingTestinomial);
router.post('/pricingTestinomial', adminController.postPricingTestinomial);
router.get('/blog', adminController.getBlog);
router.post('/blog', adminController.postBlog);
router.post('/book', adminController.postBook);
router.get('/wishlist', adminController.getWishlist);
router.post('/wishlist', adminController.postWishlist);
router.post('/wishlist/delete', adminController.deleteWishlist);

module.exports = router;