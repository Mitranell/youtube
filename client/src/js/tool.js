var tool = {};
tool.getTracklist = function(callback) {
    $.ajax({
        type: "GET",
        url: 'http://127.0.0.1:1337/getTracklist'
    }).done(function(e) {
        if(callback) callback($.parseJSON(e));
    });
};

tool.get = {};
tool.get.ww = function() {
    return $(window).width();
};
tool.get.wh = function() {
    return $(window).height();
};

module.exports = tool;
