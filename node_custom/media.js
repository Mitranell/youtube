var fs = require('fs'), //Filesystem
    path = require('path'),
    ytdl = require('ytdl-core'), //Youtube flv downloader
    ffmpeg = require('fluent-ffmpeg'), //Convert utility
    spread = require('google-spreadsheet'),
    sheet = new spread('1HqcTW5rwxhe8a7d398tE0Q_Dmp2O2ijF8I4_Sm6i5c4'), //Spreadsheet ID
    trackFolder = './client/tracks'; //Tracks now reside in client folder where they are needed

var media = function() {


    var error = {};
    error.err = function(err, callback) {
        if (callback) callback({
            error: err
        });
    };


    var tool = {};
    //Get Id from any format of youtube url.
    tool.getYTID = function(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    };
    //Normalize any format to the generic video url. (Built because mobile urls caused problems)
    tool.YTNormalize = function(url) {
        var id = tool.getYTID(url);
        return 'https://www.youtube.com/watch?v=' + id;
    };


    //Download FLV and convert to mp3
    this.convert = function(url, name, genre, callback) {
        var nameString = genre + Math.floor(Math.random() * 1000).toString() + name;
        var flv = path.resolve(trackFolder, nameString + '.flv');
        ytdl(tool.YTNormalize(url))
            .pipe(fs.createWriteStream(flv))
            .on('finish', function() {
                ffmpeg()
                    .input(flv)
                    .audioCodec('libmp3lame')
                    .save(path.resolve(trackFolder, nameString + '.mp3'))
                    .on('error', console.error)
                    .on('end', function() {
                        console.log('Finished: ' + nameString);
                        fs.unlink(flv)
                        if (callback) callback(nameString+'.mp3');
                    });
            });
    };
    //Get sheetdata from google
    this.getSheet = function(callback) {
        sheet.getRows(1, function(err, data) {
            if (err) return connection.err(err, callback);
            if (callback) callback(data);
            console.log(data);
        });
    };


};
module.exports = media;
