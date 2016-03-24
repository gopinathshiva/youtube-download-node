var path = require('path');
var fs   = require('fs');
var ytdl = require('youtube-dl');
var readline = require('readline');

var urls = ['https://www.youtube.com/watch?v=aMlhsoatlbY','https://www.youtube.com/watch?v=boHfs7nopHc'];

var video = ytdl(urls);

var size = 0;
video.on('info', function(info) {
  size = info.size;
  console.log('Got video info');
  console.log('saving to ' + info._filename);
  var output = path.join(__dirname, info._filename);
  video.pipe(fs.createWriteStream(output));
});

var pos = 0;
video.on('data', function(data) {
  pos += data.length;
  if (size) {
    var percent = (pos / size * 100).toFixed(2);
    
    if(readline.cursorTo && readline.clearLine && readline.write){
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(1);
      readline.write(percent + '%');
    }else{
      console.log(percent + '%');
    }
  }
});

video.on('end', function() {
  console.log('video completed');
});
