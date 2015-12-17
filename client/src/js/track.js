var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

url = {};
url.getName = function(track){
  youTube.getById(track, function(error, result) {
    if (error) {
      console.log(error);
    }
    else {
      console.log(result.items[0].snippet.title);
    }
  });
};

getInfo = function(trackListArray){
  var info = [];
  for (var track in trackListArray){
    info[track] = trackListArray[track].split('---');
    console.log(info[track][2] + ' - Track ' + info[track][3] + ' - URL: ' + info[track][4].substring(0,info[track][4].length - 4));
    url.getName(info[track][4].substring(0,info[track][4].length - 4));
  }
};

module.exports = {
  getInfo : getInfo
};
