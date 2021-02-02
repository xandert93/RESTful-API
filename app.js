//ENV INJECTION CODE
require('dotenv').config();

//MONGOOSE CODE
const { connect } = require('mongoose');

//SERVER CODE
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//USING MONGOOSE TO CONNECT THIS SERVER APP TO MONGODB
connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//ROUTING CODE
const articlesRouter = require('./routes/articles');
app.use('/articles', articlesRouter);

app.listen(process.env.PORT || 3000, () =>
  console.log('server running on port 3000')
);
