const express = require('express');
const bodyParser = require('body-parser');
const ingredientRouter = require('./router/ingredientRouter');
const usersRouter = require('./router/usersRouter');
const reviewRouter = require('./router/reviewRouter');
const morgan = require('morgan');
const app = express();

let brandRouter = require('./router/brand/brand.controller');
let feedRouter = require('./router/feed/feed.controller');

app.use(bodyParser.urlencoded({ extended: true}))
app.use(morgan('dev'));
app.use(ingredientRouter);
app.use(usersRouter);
app.use(reviewRouter);
app.use('/brands', brandRouter);
app.use('/feeds', feedRouter);

app.use(function(err, req, res, next) {
    console.log(err);
    res.sendStatus(404);
});

app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send({mag: err.message});
});

app.listen(3333, function(){
    console.log('Server is listening 3333');
});