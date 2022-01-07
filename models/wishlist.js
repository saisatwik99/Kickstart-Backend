const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content1: {
    type: String,
    required: true
  },
  content2: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  reviews: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);