const { Router } = require('express');
const router = Router();
const Article = require('../models/Article');

router
  .route('/')

  .get((req, res) => {
    Article.find({})
      .then((foundArticles) => {
        foundArticles !== []
          ? res.send('foundArticles')
          : res.send('Collection is empty.');
      })
      .catch((err) => res.send({ message: err.message }));
  })

  .post((req, res) => {
    let { title, content } = req.body;
    new Article({ title, content })
      .save()
      .then((savedArticle) => res.status(201).send('created your document'))
      .catch((err) => res.send({ message: err.message }));
  })

  .delete((req, res) => {
    Article.deleteMany()
      .then((result) => res.send('deleted all documents'))
      .catch((err) => res.send({ message: err.message }));
  });

router
  .route('/:articleTitle')
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

module.exports = router;
