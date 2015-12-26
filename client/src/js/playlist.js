var playlist = function(dom, audio, timing) {

    var trackNumber = 0;
    var startMs = 0;

    var handle = this;
    this.play = function(data) {
        var track = data[trackNumber];
        dom.setTrackInfo(track.ytTitle, track.name);
        dom.changeTheme(track.genre.split('.')[0] - 1);
        //startMs = timing.getCurMs();
        audio.play(track.src, function() {
            trackNumber++;
            if (trackNumber < data.length) handle.play(data);
            else console.log('klaar');
        });
    };
    this.progress = function(data, callback) {
        var dur = data[trackNumber].duration,
            cur = audio.getTime() * 1000, //Seconds to miliseconds
            percentage = (cur / dur) * 100;
        if (callback) callback(percentage);
    };
    this.setNavigation = function(data) {
        dom.admin.previous.click(function(){
            if(trackNumber > 0) {
                trackNumber--;
                handle.play(data);
                dom.admin.play.removeClass("fa-play");
                dom.admin.play.addClass("fa-pause");
            }
        });
        dom.admin.play.click(function(){
            if (audio.isPlaying()) {
                audio.pause();
                dom.admin.play.removeClass("fa-pause");
                dom.admin.play.addClass("fa-play");
            } else {
                audio.unpause();
                dom.admin.play.removeClass("fa-play");
                dom.admin.play.addClass("fa-pause");
            }
        });
        dom.admin.next.click(function(){
            if (data.length > trackNumber + 1) {
                trackNumber++;
                handle.play(data);
                dom.admin.play.removeClass("fa-play");
                dom.admin.play.addClass("fa-pause");
            }
        });
    };
};
module.exports = playlist;
