const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  postImageSrc: {
    type: String
  },
  authorImageSrc: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  authorName: {
    type: String
  },
  authorProfile: {
    type: String
  },
  url: {
    type: String
  },
  featured: {
    type: Boolean
  }
});

module.exports = mongoose.model('Blog', blogSchema);