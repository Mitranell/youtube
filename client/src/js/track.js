var YouTube = require('youtube-node');
var youtube = new YouTube();
youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

var trackString = '';
url = {};
url.getName = function(track, callback){
  youtube.getById(track, function(error, result) {
    if (error) {
      console.log(error);
    }
    else {
      document.getElementById("track").innerHTML = trackString.concat(result.items[0].snippet.title);
    }
  });
};

getInfo = function(trackListArray){
  var info = [];
  for (var track in trackListArray){
    info[track] = trackListArray[track].split('---');

    var name = info[track][2];
    var trackNumber =  info[track][3];
    var youtubeURL = info[track][4].substring(0,info[track][4].length - 4);

    trackString = name + ' - Number ' + trackNumber + ' - URL: ' + youtubeURL + ' - Titel: ';
    url.getName(youtubeURL);
  }
};

module.exports = {
  getInfo : getInfo
};
