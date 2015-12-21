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
        var max = 0;
        var rotation = 0;
        var x = 0;
        var spectrum = {};
        spectrum.data = spectrumData;
        spectrum.size = spectrum.data.length / 6; //Only display the first 1/6th of the spectrum
        spectrum.barWidth = (dom.canvasWrapperWidth() / spectrum.size);

        //Draw frequencyBars to canvas
        c.ctx.clearRect(0, 0, dom.canvasWrapperWidth(), dom.canvasWrapperHeight());
        for (var i = 0; i < spectrum.size; i++) {
            spectrum.barHeight = spectrum.data[i] * dom.canvasWrapperHeight();
            c.ctx.fillStyle = color.white;
            c.ctx.fillRect(x, dom.canvasWrapperHeight() / 2 - spectrum.barHeight / 2, spectrum.barWidth, spectrum.barHeight);
            x += spectrum.barWidth * 2; //Makes it display 1/12th of the spectrum

            if (max < spectrum.data[i]) {
              max = spectrum.data[i];
              rotation = (2 * i / spectrum.size - 1) * 10; //Rotate left and right 10 degrees
            }
        }

        dom.kick(max / 2, rotation);
    };
};
module.exports = ui;
