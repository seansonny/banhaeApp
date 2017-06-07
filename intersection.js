const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


const AllergySchema = require('./model/allergySchema');

if (mongoose.connection.readyState < 1)
    mongoDB.connect();
