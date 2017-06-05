const express = require('express');
const bodyParser = require('body-parser');
const ingredientRouter = require('./router/ingredient/ingredient.controller');
const usersRouter = require('./router/user/user.controller');
const reviewRouter = require('./router/review/review.controller');
const morgan = require('morgan');
const app = express();
let requestRouter = require('./router/request/request.controller');

let brandRouter = require('./router/brand/brand.controller');
let feedRouter = require('./router/feed/feed.controller');
let petRouter = require('./router/pet/pet.controller');
let questionRouter = require('./router/question/question.controller');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use('ingredients', ingredientRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewRouter);
app.use('/requests', requestRouter);
app.use('/brands', brandRouter);
app.use('/feeds', feedRouter);
app.use('/pets', petRouter);
app.use('/questions', questionRouter);

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