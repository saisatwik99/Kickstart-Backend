const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
      type: Date,
      default: new Date()
  }
});

module.exports = mongoose.model('Contact', contactSchema);