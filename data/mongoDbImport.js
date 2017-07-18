convertExcel = require('excel-as-json').processFile;

convertExcel('./allergy.xlsx', './allergy.json', null, function(err,data){
    console.log(data);
});

// $ mongoimport --db banhae --collection allergys --type json --drop --file "allergy.json" --jsonArray
// $ mongoimport --db banhae --collection FEEDS --type json --drop --file "feeds.json" --jsonArray

// mongoimport --db banhae --collection FEEDS --type json --drop --file "feeds.json" --jsonArray
// mongoimport --db banhae --collection FEEDS --type json --drop --file "feeds.json" --jsonArray