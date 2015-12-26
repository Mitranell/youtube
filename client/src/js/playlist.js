var playlist = function(dom, audio, timing) {

    var trackNumber = 0;
    var startMs = 0;
    var ended = false;

    var handle = this;
    this.play = function(data) {
        var track = data[trackNumber];
        dom.setTrackInfo(track.ytTitle, track.name);
        dom.changeTheme(track.genre.split('.')[0] - 1);
        startMs = timing.getCurMs();
        audio.play(track.src, function() {
            trackNumber++;
            if (trackNumber > data.length - 1) handle.end();
            else handle.play(data);
        });
    };
    this.end = function(){
        ended = true;
        console.log('klaar');
    };
    this.progress = function(data, callback) {
        if(ended) return false;
        var dur = data[trackNumber].duration,
            curTime = audio.getCurrentTime();
        var percentage = (curTime / dur) *100;
        if (callback) callback(percentage);
    };

};
module.exports = playlist;
