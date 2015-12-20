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
        var x = 0;
        var spectrum = {};
        spectrum.data = spectrumData;
        spectrum.size = spectrum.data.length / 6; //Only display the first 1/6th of the spectrum
        spectrum.barWidth = (dom.canvasWrapperWidth() / spectrum.size);

        //Draw frequencyBars to canvas
        c.ctx.clearRect(0, 0, dom.canvasWrapperWidth(), dom.canvasWrapperHeight());
        for (var i = 0; i < spectrum.size; i++) {
            //TODO We have to choose a value which is best for the TV
            spectrum.barHeight = spectrum.data[i] * 1300;
            c.ctx.fillStyle = color.white;
            c.ctx.fillRect(x, dom.canvasWrapperHeight() / 2 - spectrum.barHeight / 2, spectrum.barWidth, spectrum.barHeight);
            x += spectrum.barWidth * 2; //Makes it display 1/12th of the specturm

            if (spectrum.data[i] > max) max = spectrum.data[i];
        }

        //TODO choose between these two lines (or variants of it):
        //dom.kick((spectrum.data[1] + spectrum.data[2]) / 4);
        dom.kick(max / 2);
    };
};
module.exports = ui;
