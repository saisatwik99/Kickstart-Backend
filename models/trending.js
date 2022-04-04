const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trendingSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  trendingText: {
    type: String,
    required: true
  },
  soldTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
  
});

module.exports = mongoose.model('Trending', trendingSchema);