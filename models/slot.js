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
  },
  date: {
    type: String
  },
  time: {
    type: String
  },
  name: {
    type: String
  }
});

module.exports = mongoose.model('Slot', slotSchema);