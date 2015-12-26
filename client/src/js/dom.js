var elements = require('./elements.js');

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
dom.kick = function(factor, rotation, speed, perspective) {
    TweenLite.set(elements.theater, {
        transformPerspective : perspective
      });
    TweenLite.to(elements.theater, speed, {
        scale: 1 + factor
    });
    TweenLite.to(elements.theater, speed, {
        rotationX: rotation,
        transformOrigin: "50% 75%" //Location: upper lip = where spine is attached to head
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
dom.getRange = function() {
    return elements.range.slider("value");
};
dom.getDegrees = function() {
    return elements.degrees.slider("value");
};
dom.getSpeed = function() {
    return elements.speed.slider("value");
};
dom.getPerspective = function() {
    return elements.perspective.slider("value");
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
