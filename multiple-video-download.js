var path = require('path');
var fs   = require('fs');
var ytdl = require('youtube-dl');

var videoObj = {};

var urls = ['https://www.youtube.com/watch?v=AGuoP60VWps'];

for(var i=0;i<urls.length;i++){
  videoObj[i] = ytdl(urls[i],
  // Optional arguments passed to youtube-dl.
  ['-f', '22,17,18']);


  videoObj['size'+i] = 0;
  (function(i){
    videoObj[i].on('info', function(info) {
      videoObj['size'+i] = info.size;
      console.log('Got video '+i);
      console.log('saving to ' + info._filename);
      var output = path.join(__dirname, info._filename);
      videoObj[i].pipe(fs.createWriteStream(output));
    });

    videoObj['pos'+i] = 0;
    videoObj[i].on('data', function(data) {
      videoObj['pos'+i] += data.length;
      // `size` should not be 0 here.
      if (videoObj['size'+i]) {
        var percent;
        process.stdout.cursorTo(0);
        process.stdout.clearLine(1);
        process.stdout.clearLine(2);
        process.stdout.clearLine(3);
        var text = '';
        for(var j = 0;j<urls.length;j++){
          percent = ((+videoObj['pos'+j]) / (+videoObj['size'+j]) * 100).toFixed(2);
          text = 'video '+j+' : '+percent + '% '+' ';
          process.stdout.write(text);
        }
        //text.substr(0,text.length-2);
      }
    });

    videoObj[i].on('end', function() {
      console.log('video '+i+' completed');
    });
  })(i)
  
}

