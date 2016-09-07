const db = require('../db');
const Comment = db.model('Comment', {
  author: { type: String, required: true },
  text: { type: String, required: true }
});

module.exports = Comment;
