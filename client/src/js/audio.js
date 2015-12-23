//We can use multiple dancer instances (e.g. one for music, one for voice etc..)
var dancer = new Dancer();
var setSrc = function(url) {
    dancer.load({
        'src': url
    });
};

//Public audio object
var audio = {};
audio.play = function(src, ended) {
    audio.pause();
    setSrc('../client/tracks/' + src);
    dancer.play();

    dancer.source.onended = function() {
        if(ended) ended();
    };
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
audio.getTime = function() {
    return dancer.getTime();
};
audio.deltaTime = function(previous) {
    return dancer.getTime() - previous > 0;
};
audio.isPlaying = function(count) {
    return count < 10; //Not too low to be sure the audio is playing
};
module.exports = audio;
