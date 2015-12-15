deadline = '2016-01-01';
getRemaining = function() {
    var t = Date.parse(deadline) - Date.now();
    var s = Math.floor((t / 1000) % 60);
    var m = Math.floor((t / 1000 / 60) % 60);
    var h = Math.floor((t / (1000 * 60 * 60)) % 24);
    var d = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': d,
        'hours': h,
        'minutes': m,
        'seconds': s
    };
};
getCurMs = function() {
    return Date.now();
};
getRemainingMs = function() {
    return getRemaining().total;
};
console.log('CurMs:' + getCurMs());
console.log('Till deadline:');
var rem = getRemaining();
console.log('Days:' + rem.days);
console.log('hours:' + rem.hours);
console.log('minutes:' + rem.minutes);
console.log('seconds:' + rem.seconds);

module.exports = {
  getCurMs : getCurMs
};
