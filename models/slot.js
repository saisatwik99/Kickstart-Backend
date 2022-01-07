const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const slotSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdAt: {
      type: Date,
      default: new Date()
  }
});

module.exports = mongoose.model('Slot', slotSchema);