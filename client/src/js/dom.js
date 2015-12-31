var elements = require('./elements.js');

elements.final.click(function() {
    dom.setFinalCountdown();
});

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
    elements.clock.seconds.html(obj.s - 1);
};
dom.setTrackInfo = function(number, title, name){
    var decoded = atob(title); //Decode the base64 title string
    elements.trackInfo.find('.table-cell').html(number + '. ' + decoded + ' - ' + name);
};
dom.setProgressBar = function(percentage){
    TweenLite.set(elements.progress, {
        width: percentage + '%'
    });
};
dom.setFinalCountdown = function(){ //Needs a lot of adjustment
    TweenLite.to([elements.canvasWrapper, elements.canvas], 1, {
        top: '-200%'
    });
    TweenLite.to(elements.trackInfo, 1, {
        opacity: 0
    });
    TweenLite.to(elements.bar, 1, {
        height: '100%'
    });
    TweenLite.to(elements.clock.div, 1, {
        width: '100%',
        right: 0,
        fontSize: '20rem'
    });
    TweenLite.to(elements.progress, 0.5, {
        opacity: 0
    });
    dom.changeTheme(1);
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
dom.startAnimation = function(callback) {
    elements.leftEye.css('opacity', 0);
    elements.rightEye.css('opacity', 0);
    TweenLite.to([elements.detailing, elements.teeth, elements.logo], 2, {
        opacity: 0
    });
    TweenLite.to(elements.theater, 2, {
        scale: 8,
        onComplete: callback
    });
};
dom.showNewTrack = function(genre, callback){
    elements.clock.div.hide();
    elements.progress.hide();
    TweenLite.set(elements.bar, {
        zIndex: 100,
        height: '100%'
    });

    elements.trackInfo.addClass('blurred');
    TweenLite.to(elements.trackInfo, 1, {
        width: '100%',
        left: 0,
        color: 'black',
        //fontSize: '20rem'
        onComplete: function(){
            elements.trackInfo.removeClass('blurred');
            TweenLite.to(elements.trackInfo, 0.5, {
                opacity: 0,
                delay: 2
            });
        }
    });
    TweenLite.to(elements.trackInfo, 5, {
        //Blur...
        onComplete: callback
    });
};
dom.reverseAnimation = function(callback) {
    elements.clock.div.show();
    elements.progress.show();
    TweenLite.to(elements.trackInfo, 2, {
        color: '#ffffff',
        width: 'auto',
        left: 25
    });
    TweenLite.to(elements.bar, 2, {
        height: 100,
        onComplete: function() {
                        // elements.bar.css('z-index', 0);
                        TweenLite.set(elements.bar, {
                            zIndex: 0
                        });
                        TweenLite.to(elements.trackInfo, 2, {
                            opacity: 1
                        });
                    }
    });
    TweenLite.to([elements.detailing, elements.teeth, elements.logo], 2, {
        opacity: 1,
        onComplete: function() {
                        // elements.leftEye.css('opacity', 1);
                        // elements.rightEye.css('opacity', 1);

                        TweenLite.set(elements.leftEye, {
                            opacity: 1
                        });
                        TweenLite.set(elements.rightEye, {
                            opacity: 1
                        });
                    }
    });
    TweenLite.to(elements.theater, 2, {
        scale: 1,
        onComplete: callback
    });
};
dom.hideTimer = function(){
    TweenLite.to(elements.clock.div, 0.5, {
        opacity: 0
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

dom.startVideo = function(){
    TweenLite.to(elements.main, 0.5, {
        opacity: 0
    });
    elements.videoElem.play();
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
        case 49: // 1
            dom.changeTheme(0);
            break;
        case 50: // 2
            dom.changeTheme(1);
            break;
        case 51: // 3
            dom.changeTheme(2);
            break;
        case 52: // 4
            dom.changeTheme(3);
            break;
        case 53: // 4
            dom.startVideo();
            break;
        case 70: // f
            dom.setFinalCountdown();
            break;

        default:
            return;
    }
    e.preventDefault();
});

module.exports = dom;
