var express = require('express');
var bodyParser = require('body-parser');
var ingredientRouter = require('./router/ingredientRouter');
var morgan = require('morgan');
var bodyParser = require('body-parser');

//라우터 include
/*var ingredientRouter = require('./ingredientRouter');*/
var brandRouter = require('./route/brand/brand.router');

var app = express();
app.use(bodyParser.urlencoded({ extended: true}))
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}))

//라우터 동작
// app.use(ingredientRouter);
app.use('/brands', brandRouter);

app.use(function(req, res, next) {
    res.sendStatus(404);
});

app.use(function (err, req, res, next) {
    res.status(500).send({mag: err.message});
});

app.listen(3333, function(){
    console.log('Server is listening 3333');
});