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
    dancer.pause();
    setSrc('../client/tracks/' + src);
    dancer.play();
    console.log(dancer);

    dancer.source.onended = function() {
        if(ended) ended();
    };
};
audio.getCurrentTime = function(){
    if(dancer.source) return dancer.source.currentTime *1000; //To ms
};
audio.pause = function() {
    dancer.pause();
};
audio.unpause = function() {
    dancer.play();
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
audio.isPlaying = function(count) {
    return dancer.isPlaying();
};
module.exports = audio;
