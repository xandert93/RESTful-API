//MONGOOSE CODE
const { connect, Schema, model } = require('mongoose');

//SERVER CODE
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//USING MONGOOSE TO CONNECT THIS SERVER APP TO MONGODB
connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

//GET SENDS BACK ALL ARTICLES (STRINGIFIED)

//POST CREATES NEW ARTICLE IN COLLECTION
//USE POSTMAN TO SIMULATE POST (cba with HTML form etc.)

app
  .route('/articles')
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      err ? res.send(err) : res.send(foundArticles);
    });
  })
  .post((req, res) => {
    let { title, content } = req.body;
    new Article({ title, content }).save((err, result) =>
      err ? res.send(err) : res.send('created your document')
    );
  })
  .delete((req, res) => {
    Article.deleteMany((err, result) => {
      err ? res.send(err) : res.send('deleted all documents');
    });
  });

app.listen(process.env.PORT || 3000, () =>
  console.log('server running on port 3000')
);

app
  .route('/articles/:articleTitle')
  .get((req, res) => {
    let { articleTitle: title } = req.params;
    Article.findOne({ title }, (err, foundArticle) => {
      foundArticle
        ? res.send(foundArticle)
        : res.send('no matching document found');
    });
  })
  .put((req, res) => {
    let { articleTitle: title } = req.params;
    let { newTitle, newContent } = req.body;

    Article.update(
      { title },
      { title: newTitle, content: newContent },
      { overwrite: true },
      (err, result) => {
        result
          ? res.send('chosen document overwritten')
          : res.send('no document overwritten');
      }
    );
  })
  .patch((req, res) => {
    let { articleTitle: title } = req.params;
    let { newTitle } = req.body;
    Article.updateOne({ title }, { title: newTitle }, (err, result) => {
      !err ? res.send(result) : res.send(err);
    });
  })
  .delete((req, res) => {
    Article.findOneAndDelete(
      { title: req.params.articleTitle },
      (err, deletedArticle) => {
        deletedArticle
          ? res.send('chosen document deleted')
          : res.send('no document deleted');
      }
    );
  });
