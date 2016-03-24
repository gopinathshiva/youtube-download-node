var csv = require("fast-csv");
var fs = require('fs');
var stream = fs.createReadStream("youtube.csv");
 
csv
 .fromStream(stream)
 .on("data", function(data){
     console.log(data);
 })
 .on("end", function(){
     console.log("done");
 });

 csv
   .fromPath("youtube.csv", {headers: true})
   .transform(function(obj){
        return {
            Title: obj.Title
        };
   })
   .pipe(csv.createWriteStream({headers: true}))
   .pipe(fs.createWriteStream("out.csv", {encoding: "utf8"}));