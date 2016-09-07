const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/comments', () => {
  console.log("MongoDB connected");
});

module.exports = mongoose;
