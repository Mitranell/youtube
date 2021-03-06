var fs = require('fs'), //Filesystem
    path = require('path'),
    ytdl = require('ytdl-core'), //Youtube flv downloader
    ffmpeg = require('fluent-ffmpeg'), //Convert utility
    spread = require('google-spreadsheet'),
    sheet = new spread('1yHVy27G84f53ejmfYQ_xT9ibjLwdTscPmpk2pPJ-YtI'), //Spreadsheet ID
    trackFolder = './client/tracks'; //Tracks now reside in client folder where they are needed

var media = function() {

    var error = {};
    error.err = function(err, callback) {
        if (callback) callback({
            error: err
        });
    };

    //Download FLV and convert to mp3
    this.convert = function(url, id, name, genre, callback) {
        var nameString = genre + Math.floor(Math.random() * 1000).toString() + name;
        var flv = path.resolve(trackFolder, nameString + '.flv');
        ytdl(url)
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
