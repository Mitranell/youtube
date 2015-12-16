var audio = require('./audio.js');
var timing = require('./timing.js');

var elements = {};
elements.canvasWrapper = $('#canvasWrapper');
elements.canvasWrapperWidth = function(){
    return elements.canvasWrapper.width();
};
elements.canvasWrapperHeight = function(){
    return elements.canvasWrapper.height();
};
elements.theater = $('#theater');
elements.skull = $('#skull');

var color = {};
color.bg = '#1e2230';
color.blue = '#26477d';
color.white = 'rgba(255,255,255,1)';

c = document.getElementById("canvas");
ctx = c.getContext("2d");
resize = function() {
    c.width = elements.canvasWrapperWidth();
    c.height = elements.canvasWrapperHeight();
};
render = function() {
    requestAnimationFrame(render);
    var curMs = timing.getCurMs();
    draw();
};
canAnimateKick = true;
kick = function() {
    console.log('kick');
    canAnimateKick = false;
    TweenLite.to(elements.theater, 0.1, {
        scale: 1.05,
        onComplete: function() {
            canAnimateKick = true;
        }
    });
};
noKick = function() {
    if (canAnimateKick) {

        TweenLite.to(elements.theater, 0.1, {
            scale: 1
        });
    }
};
draw = function() {
    var spectrum = {};
    spectrum.data = audio.getSpectrum();
    spectrum.size = spectrum.data.length / 6;
    spectrum.barWidth = (elements.canvasWrapperWidth() / spectrum.size);
    x = 0;

    ctx.clearRect(0, 0, elements.canvasWrapperWidth(), elements.canvasWrapperHeight());
    for (var i = 0; i < spectrum.size; i++) {
        spectrum.barHeight = spectrum.data[i] * 1500;
        ctx.fillStyle = color.white;
        ctx.fillRect(x, elements.canvasWrapperHeight() / 2 - spectrum.barHeight / 2, spectrum.barWidth, spectrum.barHeight);
        x += spectrum.barWidth*2;
    }
};

module.exports = {
  kick : kick,
  noKick : noKick,
  render : render,
  resize : resize
};
