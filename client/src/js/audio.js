var test = require('./test.js');
var elements = require('./elements.js');

audio = new Audio();
dancer = new Dancer();

setSrc = function(url) {
    dancer.load({
        'src': url
    });
};
startPlaylist = function(trackListArray) {
    var src = trackListArray[Math.floor(Math.random() * trackListArray.length)];
    setSrc(test.dir + src);
    play();
};
play = function() {
    dancer.play();
};
pause = function() {
    dancer.pause();
};
setVolume = function(vol) {
    dancer.setVolume(vol); //Volume from 0 to 1
};
getSpectrum = function() {
    return dancer.getSpectrum();
};
getWaveform = function() {
    return dancer.getWaveform();
};
kick = dancer.createKick({
    frequency: [1, 3],
    threshold: 0.4,
    onKick: function(mag) {
        elements.kick();
    },
    offKick: function(mag) {
        elements.noKick();
    }
});
kick.on();

module.exports = {
  getSpectrum : getSpectrum,
  startPlaylist : startPlaylist
};
