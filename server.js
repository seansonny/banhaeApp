const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const app = express();

const ingredientRouter = require('./router/ingredient/ingredient.controller');
const usersRouter = require('./router/user/user.controller');
const reviewRouter = require('./router/review/review.controller');
const requestRouter = require('./router/request/request.controller');
const brandRouter = require('./router/brand/brand.controller');
const feedRouter = require('./router/feed/feed.controller');
const petRouter = require('./router/pet/pet.controller');
const questionRouter = require('./router/question/question.controller');

app.use( (req, res, next) => {
    console.log('cookie :', req.headers['cookie']);
    next();
});

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());
/*app.use( (req, res, next) => { console.log(req.headers['content-type']); next(); } );*/

app.use('/ingredients',ingredientRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewRouter);
app.use('/requests', requestRouter);
app.use('/brands', brandRouter);
app.use('/feeds', feedRouter);
app.use('/pets', petRouter);
app.use('/questions', questionRouter);

app.use(function(err, req, res) {
    console.log(err);
    res.status(404).send();
});

app.use(function (err, req, res) {
    console.log(err);
    res.status(500).send({mag: err.message});
});

app.listen(3333, function(){
    console.log('Server is listening 3333');
});