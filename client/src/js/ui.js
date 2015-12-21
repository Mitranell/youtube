var color = {};
color.bg = '#1e2230';
color.blue = '#26477d';
color.white = 'rgba(255,255,255,1)';

var ui = function(dom) {
    var c = {};
    c.c = document.getElementById("canvas");
    c.ctx = c.c.getContext("2d");
    this.resize = function() {
        c.c.width = dom.canvasWrapperWidth();
        c.c.height = dom.canvasWrapperHeight();
    };
    this.render = function(spectrumData) {
        var x = 0;
        var max = 0;
        var rotation = 0;
        var range = 10; //Range of bars (max 512) who determine the rotation, bars above range is all full to the right
        var degrees = 5; //Ammount of degrees the skull is rotate left and right

        var spectrum = {};
        spectrum.data = spectrumData;
        spectrum.size = spectrum.data.length / 6; //Only display the first 1/6th of the spectrum
        spectrum.barWidth = (dom.canvasWrapperWidth() / spectrum.size);

        //Draw frequencyBars to canvas
        c.ctx.clearRect(0, 0, dom.canvasWrapperWidth(), dom.canvasWrapperHeight());
        for (var i = 0; i < spectrum.data.length; i++) {
            if(i < spectrum.size){
              spectrum.barHeight = spectrum.data[i] * dom.canvasWrapperHeight();
              c.ctx.fillStyle = color.white;
              c.ctx.fillRect(x, dom.canvasWrapperHeight() / 2 - spectrum.barHeight / 2, spectrum.barWidth, spectrum.barHeight);
              x += spectrum.barWidth * 2; //Makes it display 1/12th of the spectrum
            }

            if (max < spectrum.data[i]) {
              max = spectrum.data[i];
              bar = (i > range) ? range : i;
              rotation = (2 * bar / range  - 1) * degrees;
            }
        }

        dom.kick(max / 2, rotation);
    };
};
module.exports = ui;
