var csv = require("fast-csv");
var fs = require('fs');

var output = {};

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

var csvFiles = getFiles('output-csv');

if(csvFiles.length){
	readAndCountRows(0);
}else{
	console.warn('No csv file found');
}

function readAndCountRows(fileIndex){
	var storename = csvFiles[fileIndex];
	storename = storename.split('/')[1];
	storename = storename.split('-')[1];

	//console.log('Reading and Counting Rows for file file: '+csvFiles[fileIndex]);
	var stream = fs.createReadStream(csvFiles[fileIndex]);
	var rows;
	csv.fromStream(stream).on("data", function(data){
		if(rows == undefined){
			rows = 0;
		}else{
			rows++;
		}
	})
	.on("end", function(){
		if(!output[storename]){
			output[storename] = {};
			output[storename].csvFile = csvFiles[fileIndex];
			output[storename].rowCount = rows;
		}
		fileIndex++;
		if(csvFiles[fileIndex]){
			readAndCountRows(fileIndex);	
		}else{
			console.log("csv read and count done");
			console.log(output);
		}
	});
}
 
