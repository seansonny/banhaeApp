var express = require('express');
var bodyParser = require('body-parser');
var ingredientRouter = require('./router/ingredientRouter');
var morgan = require('morgan');
var app = express();
app.use(bodyParser.urlencoded({ extended: true}))
app.use(morgan('dev'));

app.use(ingredientRouter);

app.use(function(err, req, res, next) {
    console.log(err);
    res.sendStatus(404);
});

app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send({mag: err.message});
});

app.listen(3330, function(){
    console.log('Server is listening 3330');
});
