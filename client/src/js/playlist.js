var playlist = function(dom, audio, timing) {

    var trackNumber = 0;
    var startMs = 0;
    var ended = false;

    var handle = this;
    this.play = function(data) {
        var track = data[trackNumber];
        dom.setTrackInfo(track.ytTitle, track.name);
        dom.changeTheme(track.genre.split('.')[0] - 1);
        dom.startAnimation(function(){
            audio.play(track.src, function() {
                trackNumber++;
                if (trackNumber < data.length) handle.play(data);
                else handle.end();
            });
        });
    };
    this.end = function(){
        ended = true;
        console.log('klaar');
    };
    this.progress = function(data, callback) {
        if(ended) return false;
        var dur = data[trackNumber].duration,
            cur = audio.getTime() * 1000, //Seconds to miliseconds
            percentage = (cur / dur) * 100;
        if (callback) callback(percentage);
    };
    this.setNavigation = function(data) {
        dom.admin.previous.click(function(){
            handle.playPrevious(data);
        });
        dom.admin.play.click(function(){
            handle.playCurrent(data);
        });
        dom.admin.next.click(function(){
            handle.playNext(data);
        });
    };
    this.playPrevious = function (data) {
        if(trackNumber > 0) {
            trackNumber--;
            handle.play(data);
            dom.admin.play.removeClass("fa-play");
            dom.admin.play.addClass("fa-pause");
        }
    };
    this.playCurrent = function (data) {
        if (audio.isPlaying()) {
            audio.pause();
            dom.admin.play.removeClass("fa-pause");
            dom.admin.play.addClass("fa-play");
        } else {
            audio.unpause();
            dom.admin.play.removeClass("fa-play");
            dom.admin.play.addClass("fa-pause");
        }
    };
    this.playNext = function (data) {
        if (data.length > trackNumber + 1) {
            trackNumber++;
            handle.play(data);
            dom.admin.play.removeClass("fa-play");
            dom.admin.play.addClass("fa-pause");
        }
    };
};

module.exports = playlist;
