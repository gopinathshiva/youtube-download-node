var csv = require("fast-csv");
var fs = require('fs');
var headers = ["INDEX", "TITLE", "TYPE","DESCRIPTION","EXPIRY","CODE","URL","CATEGORIES"];

var expiryColumn = headers.indexOf('EXPIRY');
var urlColumn = headers.indexOf('URL');
var descriptionColumn = headers.indexOf('DESCRIPTION');
var categoriesColumn = headers.indexOf('CATEGORIES');

if(expiryColumn<0){
	console.warn('No EXPIRY column');
}

if(urlColumn<0){
	console.warn('No URL column');
}

if(descriptionColumn<0){
	console.warn('No DESCRIPTION column');
}

if(categoriesColumn<0){
	console.warn('No CATEGORIES column');
}

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
	readAndSanityCsv(0);
}else{
	console.warn('No csv file found');
}

function readAndSanityCsv(fileIndex){
	console.log('Reading and writing file: '+csvFiles[fileIndex]);
	var csvFileName = csvFiles[fileIndex];
	csvFileName = csvFileName.split('/');
	csvFileName = csvFileName[csvFileName.length-1];

	var csvStream = csv.createWriteStream({headers : headers}),
    	writableStream = fs.createWriteStream('output-csv/'+csvFileName);

	writableStream.on("finish", function(){
	  console.log("csv write DONE!");
	});
 
	csvStream.pipe(writableStream);

	var stream = fs.createReadStream(csvFiles[fileIndex]);

	csv.fromStream(stream).on("data", function(data){

		//if(!fileIndex || headers.indexOf(data[0])<0){
			if(isNaN(Date.parse(data[expiryColumn]))){
				data[expiryColumn] = new Date();
				data[expiryColumn] = data[expiryColumn].setDate(data[expiryColumn].getDate()+14);
				data[expiryColumn] = new Date(data[expiryColumn]);
				data[expiryColumn] = getFormattedDate(data[expiryColumn]);
			}
			if(data[urlColumn] && data[urlColumn] =='http://www.snapdeal.com/offers/electronics-'){
				console.log(data[urlColumn].indexOf('utm_source'));
				console.log(data[urlColumn].substr(0,data[urlColumn].indexOf('utm_source')));
			}
			if(data[descriptionColumn] && data[descriptionColumn].indexOf('Verified on')>=0){
				data[descriptionColumn] = data[descriptionColumn].substr(data[descriptionColumn].indexOf('.')+1);
			}
			if(data[categoriesColumn]){
				var offer_categories = data[categoriesColumn];
				offer_categories = offer_categories.split(',');
				while(offer_categories.indexOf('undefined')>=0){
					offer_categories.splice(offer_categories.indexOf('undefined'),1);
				}
				data[categoriesColumn] = offer_categories.join(',');
			}
			
			if(data[urlColumn] && data[urlColumn].indexOf('utm_source')>=0){
				data[urlColumn] = data[urlColumn].substr(0,data[urlColumn].indexOf('utm_source'));
			}
			csvStream.write(data);
		//}

	})
	.on("end", function(){
		fileIndex++;
		if(csvFiles[fileIndex]){
			readAndSanityCsv(fileIndex);	
		}else{
			console.log("csv read done");
			csvStream.end();
		}
	});

	function getFormattedDate(date) {
	  var year = date.getFullYear();
	  var month = (1 + date.getMonth()).toString();
	  month = month.length > 1 ? month : '0' + month;
	  var day = date.getDate().toString();
	  day = day.length > 1 ? day : '0' + day;
	  return month + '/' + day + '/' + year;
	}
}
 
