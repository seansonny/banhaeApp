convertExcel = require('excel-as-json').processFile;
var mongoose = require('mongoose');

convertExcel('./allergyN.xlsx', './allergyN.json', null, function(err,data){
    console.log(data);
});

// $ mongoimport --db banhae --collection allergys --type json --drop --file "allergy.json" --jsonArray
// $ mongoimport --db banhae --collection FEEDS --type json --drop --file "feeds.json" --jsonArray
