const express = require('express');
var router = express.Router();

router.route('/')
    .get(currentVersion);

function currentVersion(req, res){
    res.send({msg: 'beta'});
}