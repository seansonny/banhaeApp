const express = require('express');

const brandModel = require('./brand.model.js');
const mysql = require('../../database/mysqlConfig');


exports.showBrands = function(req, res, next) {
    /*res.send(brandModel);*/

    brandModel.findAll().then((brands) => {
        res.json(brands);
    }).catch(function (err) {
        res.send(err);
    });
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