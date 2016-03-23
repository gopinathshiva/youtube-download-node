var Youtube = require('youtube-video-api');
var fs = require('fs');

var clientSecret,clientId;

var ResumableUpload = require('node-youtube-resumable-upload');
var resumableUpload = new ResumableUpload(); //create new ResumableUpload 

fs.readFile('.google-oauth2-credentials.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  content = JSON.parse(content);
  //clientSecret = content.installed.client_secret;
  //clientId = content.installed.client_id;
  resumableUpload.tokens = content; //Google OAuth2 tokens 
  authenticateYoutube();
});

function authenticateYoutube(){

  var metadata = {
    snippet: {
      title: 'dummy title',
      description: 'dummy description',
      tags: 'dummy tags'
    },
    status: {
      privacyStatus:'private'
    }
  };

  resumableUpload.filepath = './video.mp4';
  resumableUpload.metadata = metadata; //include the snippet and status for the video 
  resumableUpload.retry = 3; // Maximum retries when upload failed. 
  resumableUpload.upload();
  resumableUpload.on('progress', function(progress) {
    console.log(progress);
  });
  resumableUpload.on('success', function(success) {
    console.log(success);
  });
  resumableUpload.on('error', function(error) {
    console.log(error);
  });
}


