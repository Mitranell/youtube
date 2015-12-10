var modules = './node_custom/';

//Node modules
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    Api = require(modules + 'api.js');

//Declare client folder as static so that every request gets through
app.use('/client', express.static(__dirname + '/client'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
}));

//Default Server route
app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: __dirname + '/client'
    });
});

var api = new Api(express, app);

//Start the node server on specified port
http.listen(1337, function() {
    console.log('Server set up on 127.0.0.1:1337');
});

//hoi test comment
//test comment 2
