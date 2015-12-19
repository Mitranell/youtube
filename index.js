var modules = './node_custom/';

//Node modules
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    Api = require(modules + 'api.js');


//Declare client folder as static so that every request gets through
app.use('/client', express.static(__dirname + '/client'));
app.use(bodyParser.json()); //For sending/receiving application/json
app.use(bodyParser.urlencoded({
    extended: true
}));

var api = new Api(express, app);
http.listen(1337, function() {
    console.log('Server set up on 127.0.0.1:1337');
});
