const { Schema, model } = require('mongoose');

const Article = model(
  'Article',
  new Schema({
    title: {
      type: String,
      required: 1,
    },
    content: {
      type: String,
      required: 1,
    },
  })
);

module.exports = Article;
