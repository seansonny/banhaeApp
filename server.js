const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./database/mysqlConfig');

//라우터 include
/*var ingredientRouter = require('./ingredientRouter');*/
const brandRouter = require('./route/brand/brand.router');

let app = express();
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