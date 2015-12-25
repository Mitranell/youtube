canAnimateKick = true;

//Dom element hooks
var elements = {};
elements.shirt = $('#shirt');
elements.canvasWrapper = $('#canvasWrapper');
elements.canvas = $('#canvas');
elements.theater = $('#theater');
elements.skull = $('#skull');
elements.logo = $('#logo');
elements.clock = {};
elements.clock.hours = $('#hours');
elements.clock.minutes = $('#minutes');
elements.clock.seconds = $('#seconds');
elements.trackInfo = $('#trackInfo');
elements.progress = $('#progress');

elements.admin = {};
elements.admin.div = $('#admin');
elements.admin.themeDots = elements.admin.div.find('.themeDot');
elements.admin.themeDots.click(function(div){
    var i = $(this).index();
    dom.changeTheme(i);
});
//Public dom object
var dom = {};
dom.canvasWrapperWidth = function(){
    return elements.canvasWrapper.width();
};
dom.canvasWrapperHeight = function(){
    return elements.canvasWrapper.height();
};
dom.kick = function(factor, rotation) {
    TweenLite.to(elements.theater, 0.1, {
        scale: 1 + factor,
        rotation: rotation
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
dom.setProgressBar = function(percentage){
    TweenLite.set(elements.progress, {
        width: percentage + '%'
    });
};

dom.themes = [
    'red',
    'blue',
    'black',
    'yellow'
];
dom.changeTheme = function(i){
    var name = this.themes[i];
    function setTheme(elem){
        $.each(dom.themes, function(i, val){
            elem.removeClass(val);
        });
        elem.addClass(name);
    }
    setTheme(elements.shirt);
    setTheme(elements.canvas);
    setTheme(elements.logo);
    setTheme(elements.progress);
};

dom.admin = {};
dom.admin.open = function(){
    elements.admin.div.toggleClass('open');
};
dom.admin.previous = $("#previous");
dom.admin.play = $("#play");
dom.admin.next = $("#next");

$(document).keydown(function(e) {
    switch (e.which) {
        case 65: // a
            dom.admin.open();
            break;

        default:
            return;
    }
    e.preventDefault();
});

module.exports = dom;
