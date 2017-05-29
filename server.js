var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

//라우터 include
let ingredientRouter = require('./router/ingredientRouter');
let brandRouter = require('./router/brand/brand.controller');
let feedRouter = require('./router/feed/feed.controller');

var app = express();
app.use(bodyParser.urlencoded({ extended: true}))
app.use(morgan('dev'));

//라우터 동작
app.use(ingredientRouter);
app.use('/brands', brandRouter);
app.use('/feeds', feedRouter);

app.use(function(req, res, next) {
    res.sendStatus(404);
});

app.use(function (err, req, res, next) {
    res.status(500).send({mag: err.message});
});

app.listen(3333, function(){
    console.log('Server is listening 3333');
});