canvasWrapper = $('#canvasWrapper');
canvasWrapperWidth = function(){
    return canvasWrapper.width();
};
canvasWrapperHeight = function(){
    return canvasWrapper.height();
};
this.theater = $('#theater');
this.skull = $('#skull');

canAnimateKick = true;
kick = function() {
    console.log('kick');
    canAnimateKick = false;
    TweenLite.to(theater, 0.1, {
        scale: 1.05,
        onComplete: function() {
            canAnimateKick = true;
        }
    });
};
noKick = function() {
    if (canAnimateKick) {

        TweenLite.to(theater, 0.1, {
            scale: 1
        });
    }
};

module.exports = {
  canvasWrapperWidth : canvasWrapperWidth,
  canvasWrapperHeight : canvasWrapperHeight,
  theater : theater,
  skull : skull,
  kick : kick,
  noKick : noKick
};
