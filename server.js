const express = require('express');
const bodyParser = require('body-parser');
const Comment = require('./model/comment');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/api/comments', (req, res, next) => {
  Comment.find((err, comments) => {
    if (err) { return next(err) };
    res.json(comments);
  });
});

app.post('/api/comments', (req, res, next) => {

  let comment = new Comment({
    author: req.body.author,
    text: req.body.text
  });

  comment.save(function (err, comment) {
    if (err) { return next(err) }
    res.status(201).json(comment)
  });

});

app.listen(3000, () => {
  console.log(`Listening on port 3000...`);
});
