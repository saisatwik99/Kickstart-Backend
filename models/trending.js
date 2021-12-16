const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trendingSchema = new Schema({
  imageSrc: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  pricePerDay: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  trendingText: {
    type: String,
    required: true
  },
  durationText: {
    type: String,
    required: true
  },
  locationText: {
    type: String,
    required: true
  }
  
});

module.exports = mongoose.model('Trending', trendingSchema);