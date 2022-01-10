const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  postImageSrc: {
    type: String
  },
  title: {
    type: String
  },
  authorName: {
    type: String
  },
  url: {
    type: String
  }
});

module.exports = mongoose.model('Blog', blogSchema);