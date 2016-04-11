var csv = require("fast-csv");
var fs = require('fs');
var headers = ["INDEX", "TITLE", "TYPE","DESCRIPTION","EXPIRY","CODE","URL","CATEGORIES"];

var csvStream = csv.createWriteStream({headers : headers}),
    writableStream = fs.createWriteStream("output.csv");

writableStream.on("finish", function(){
  console.log("csv write DONE!");
});
 
csvStream.pipe(writableStream);

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

var csvFiles = getFiles('input-csv');

if(csvFiles.length){
	readAndWriteCsv(0);
}else{
	console.warn('No csv file found');
}

function readAndWriteCsv(fileIndex){
	console.log('Reading and writing file: '+csvFiles[fileIndex]);
	var stream = fs.createReadStream(csvFiles[fileIndex]);
	csv.fromStream(stream).on("data", function(data){
		if(!fileIndex || headers.indexOf(data[0])<0){
			csvStream.write(data);
		}
	})
	.on("end", function(){
		fileIndex++;
		if(csvFiles[fileIndex]){
			readAndWriteCsv(fileIndex);	
		}else{
			console.log("csv read done");
			csvStream.end();
		}
	});
}
 
