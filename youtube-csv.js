var request = require('request');
var Converter = require('csvtojson').Converter;

var csvURL = 'https://docs.google.com/spreadsheets/d/1vFj89TtHZ9IE1FKTiK9mQAaXJrIhwOqEami9HyHy8hI/pub?gid=0&single=true&output=csv';

request.get(csvURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var csv = body;
        // Continue with your processing here.
    }
});