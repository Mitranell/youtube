var playlist = function(dom, audio, timing) {

    var trackNumber = 0;
    var startMs = 0;
    var ended = false;

    var handle = this;
    this.startAnimation = function(data) {
        audio.pause();
        dom.startAnimation(function() {
            handle.showNewTrack(data);
        });
    };
    this.showNewTrack = function(data) {
        var track = data[trackNumber];
        var genre = track.genre.split('.')[0] - 1;
        dom.setTrackInfo(data.length - trackNumber - 1, track.ytTitle, track.name);
        dom.changeTheme(genre);
        dom.showNewTrack(genre, function(){
            handle.reverseAnimation(data, track);
        });
    };
    this.reverseAnimation = function(data, track) {
        dom.reverseAnimation(function() {
            handle.synchronize(data, track);
        });
    };
    this.synchronize = function(data, track) {
        var totalDuration = 0;
        for (var i = trackNumber; i < data.length-1; i++) {
            totalDuration += data[i].duration;
        }
        totalDuration = totalDuration + 5000*(i - trackNumber - 2); //5 seconds between songs

        if (timing.getRemainingMs() > totalDuration)
            setTimeout(function() {
                handle.synchronize(data, track);
            }, 1000);
        else
            handle.playNextSong(data, track);
    };
    this.playNextSong = function(data, track) {
        audio.play(track.src, function() {
            handle.songEnded(data, track);
        });
    };
    this.songEnded = function(data, track) {
        trackNumber++;
        if (trackNumber + 1 < data.length) handle.startAnimation(data);
        else handle.lastSong(data);
    };
    this.lastSong = function(data){
        if (ended) {
            console.log('klaaar!!');
            dom.hideTimer();
        } else {
            ended = true;
            dom.setFinalCountdown();
            handle.playNextSong(data, data[data.length - 1]);
        }
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
            handle.startAnimation(data);
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
            handle.startAnimation(data);
            dom.admin.play.removeClass("fa-play");
            dom.admin.play.addClass("fa-pause");
        }
    };
};

module.exports = playlist;
