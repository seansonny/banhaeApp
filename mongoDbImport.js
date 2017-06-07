convertExcel = require('excel-as-json').processFile;
var mongoose = require('mongoose');

convertExcel('./0607.xlsx', './0607.json', null, function(err,data){
    console.log(data);
});

//$ mongoimport --db banhae --collection FEEDS --type json --drop --file "0607.json" --jsonArray