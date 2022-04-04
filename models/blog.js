const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  postImageSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Blog', blogSchema);