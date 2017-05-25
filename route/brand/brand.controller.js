const express = require('express');
const router = express.Router();

const brandsModel = require('./brand.model.js');

exports.showBrands = function(req, res, next) {

    res.send("mgs");
}

exports.showBrand = function(req, res, next) {
    let brand_id = req.params.brand_id;

    res.send(brand_id);
}

exports.addBrand = function(req, res, next) {
    res.send("mgs");
}

exports.updateBrand = function(req, res, next) {
    res.send("mgs");
}

exports.deleteBrand = function(req, res, next) {
    res.send("mgs");
}