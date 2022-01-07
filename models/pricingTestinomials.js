const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pricingTestinomialSchema = new Schema({
  imageSrc: {
    type: String,
    required: true
  },
  quote: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('PricingTestinomial', pricingTestinomialSchema);