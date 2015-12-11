var fs = require('fs'),
    ytdl = require('ytdl-core'),
    ffmpeg = require('fluent-ffmpeg'),
    spread = require('google-spreadsheet'),
    path = require('path'),
    sheet = new spread('1yHVy27G84f53ejmfYQ_xT9ibjLwdTscPmpk2pPJ-YtI');

var media = function() {

    var error = {};
    error.err = function(err, callback) {
        if (callback) callback({
            error: err
        });
    };

    var tool = {};
    tool.getYTID = function(url) { //Get Id from any format of youtube url.
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    };
    tool.YTNormalize = function(url){ //Normalize any format to the generic video url.
        var id = tool.getYTID(url);
        return 'https://www.youtube.com/watch?v='+id;
    };

    this.convert = function(url, name, genre, callback) {
        var nameString = genre + Math.floor(Math.random() * 1000).toString() + name;
        var flv = path.resolve(__dirname, nameString + '.flv');
        ytdl(tool.YTNormalize(url))
            .pipe(fs.createWriteStream(flv))
            .on('finish', function() {
                ffmpeg()
                    .input(flv)
                    .audioCodec('libmp3lame')
                    .save(path.resolve(__dirname, nameString + '.mp3'))
                    .on('error', console.error)
                    .on('end', function() {
                        fs.unlink(flv)
                        console.log('Finished: ' + nameString);
                        if (callback) callback();
                    });
            });
    };

    this.getSheet = function(callback) {
        sheet.getRows(1, function(err, data) {
            if (err) return connection.err(err, callback);
            console.log(data);
            if (callback) callback(data);
        });
    };

};
module.exports = media;
