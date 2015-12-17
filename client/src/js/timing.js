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
clock = function(){
  var rem = getRemaining();
  document.getElementById("clock").innerHTML = 'days: ' + rem.days + '<br>' + 'hours: '+ rem.hours + '<br>' + 'minutes: ' + rem.minutes + '<br>' + 'seconds: ' + rem.seconds;
};

module.exports = {
  getCurMs : getCurMs,
  clock : clock
};
