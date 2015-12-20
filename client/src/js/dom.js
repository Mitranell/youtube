canAnimateKick = true;

//Dom element hooks
var elements = {};
elements.canvasWrapper = $('#canvasWrapper');
elements.theater = $('#theater');
elements.skull = $('#skull');
elements.clock = {};
elements.clock.hours = $('#hours');
elements.clock.minutes = $('#minutes');
elements.clock.seconds = $('#seconds');
elements.trackInfo = $('#trackInfo');

//Public dom object
var dom = {};
dom.canvasWrapperWidth = function(){
    return elements.canvasWrapper.width();
};
dom.canvasWrapperHeight = function(){
    return elements.canvasWrapper.height();
};
dom.kickOptions = function(){
    return {
        frequency: [1, 1],
        threshold: 0.4,
        onKick: function(mag) {
            dom.kick(mag);
        },
        offKick: function(mag) {
            dom.noKick(mag);
        }
    };
};
dom.kick = function(factor) {
    TweenLite.to(elements.theater, 0.1, {
        scale: 1 + factor
    });
};
dom.setClock = function(obj){
    elements.clock.hours.html(obj.h);
    elements.clock.minutes.html(obj.m);
    elements.clock.seconds.html(obj.s);
};
dom.setTrackInfo = function(title,name){
    var decoded = atob(title); //Decode the base64 title string
    elements.trackInfo.html(decoded + ' - ' + name);
};

module.exports = dom;
