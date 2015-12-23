var playlist = function(dom, audio) {

    var trackNumber = 0;

    var handle = this;
    this.play = function(data) {
        var track = data[trackNumber];
        dom.setTrackInfo(track.ytTitle, track.name);
        dom.changeTheme(track.genre.split('.')[0] - 1);
        audio.play(track.src, function() {
            trackNumber++;
            if (trackNumber > data.length - 1) songsFinished();
            else handle.play(data);
        });
    };
    var songsFinished = function() {
        console.log('klaar');
    };
};
module.exports = playlist;
