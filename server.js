const express = require('express');
const bodyParser = require('body-parser');

var ingredientRouter = require('./ingredientRouter');
const brandRouter = require('./route/brand/brand.controller.js');

let app = express();
app.use(bodyParser.urlencoded({ extended: false}))

//라우터 동작
app.use(ingredientRouter);
app.use('/brands', brandRouter);

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