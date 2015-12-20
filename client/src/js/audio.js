//We can use multiple dancer instances (e.g. one for music, one for voice etc..)
var dancer = new Dancer();
var setSrc = function(url) {
    dancer.load({
        'src': url
    });
};

//Public audio object
var audio = {};
audio.play = function(src) {
    setSrc('../client/tracks/' + src);
    dancer.play();
};
audio.pause = function() {
    dancer.pause();
};
audio.setVolume = function(vol) {
    dancer.setVolume(vol); //Volume from 0 to 1
};
audio.getSpectrum = function() {
    return dancer.getSpectrum();
};
audio.isPlaying = function() {
    return dancer.isPlaying();
};
module.exports = audio;
