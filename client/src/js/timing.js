// Public timing object
var timing = {};
timing.deadline = '2016-01-01';
timing.getRemaining = function(){
    function toDD(val) {
        if (val < 10) return '0' + val;
        else return val;
    }
    var obj = {};
    obj.total   =  Date.parse(timing.deadline) - Date.now();
    obj.day     =  toDD(Math.floor(obj.total / (1000 * 60 * 60 * 24)));
    obj.hours   =  toDD(Math.floor((obj.total / (1000 * 60 * 60)) % 24));
    obj.minutes =  toDD(Math.floor((obj.total / 1000 / 60) % 60));
    obj.seconds =  toDD(Math.floor((obj.total / 1000) % 60));
    return obj;
};
timing.getCurMs = function() {
    return Date.now();
};
timing.getRemainingMs = function() {
    return getRemaining().total;
};
var lastSecond = timing.getRemaining().seconds;
timing.clock = function(callback) {
    var rem = timing.getRemaining();
    var curSecond = rem.seconds;
    if(curSecond !== lastSecond){
        var obj = {};
        obj.h = rem.hours;
        obj.m = rem.minutes;
        obj.s = rem.seconds;
        if(callback) callback(obj);
    }
};

module.exports = timing;
