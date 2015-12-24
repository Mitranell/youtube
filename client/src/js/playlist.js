var playlist = function(dom, audio, timing) {

    var trackNumber = 0;
    var startMs = 0;

    var handle = this;
    this.play = function(data) {
        var track = data[trackNumber];
        dom.setTrackInfo(track.ytTitle, track.name);
        dom.changeTheme(track.genre.split('.')[0] - 1);
        startMs = timing.getCurMs();
        audio.play(track.src, function() {
            trackNumber++;
            if (trackNumber > data.length - 1) console.log('klaar');
            else handle.play(data);
        });
    };
    this.progress = function(data, callback) {
        var dur = data[trackNumber].duration,
            dif = timing.getCurMs() - startMs,
            percentage = (dif / dur) * 100;
        if (callback) callback(percentage);
    };

};
module.exports = playlist;
