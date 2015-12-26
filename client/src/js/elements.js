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
elements.range = $("#range");
elements.range.value = $("#rangeValue");
elements.degrees = $("#degrees");
elements.degrees.value = $("#degreesValue");
elements.speed = $("#speed");
elements.speed.value = $("#speedValue");
elements.perspective = $("#perspective");
elements.perspective.value = $("#perspectiveValue");

//Range of bars (max 512) who determine the rotation, bars above range is all full to the right
elements.range.slider({
    range: 'min',
    min: 1,
    max: 512,
    value: 10,
    slide: function(event, ui) {
        elements.range.value.val(ui.value);
    }
});
elements.range.value.val(elements.range.slider("value")); //Initialize

//Ammount of degrees the skull rotates
elements.degrees.slider({
    range: 'min',
    min: 1,
    max: 360,
    value: 5,
    slide: function(event, ui) {
        elements.degrees.value.val(ui.value);
    }
});
elements.degrees.value.val(elements.degrees.slider("value")); //Initialize

elements.speed.slider({
    range: 'min',
    min: 0.01,
    max: 1,
    value: 0.2,
    step: 0.01,
    slide: function(event, ui) {
        elements.speed.value.val(ui.value);
    }
});
elements.speed.value.val(elements.speed.slider("value")); //Initialize

elements.perspective.slider({
    range: 'min',
    min: 1,
    max: 1000,
    value: 500,
    slide: function(event, ui) {
        elements.perspective.value.val(ui.value);
    }
});
elements.perspective.value.val(elements.perspective.slider("value")); //Initialize

//Change slider when input is changed
elements.range.value.change(function(){
    elements.range.slider("value", $(this).val());
});
//Change slider when input is changed
elements.degrees.value.change(function(){
    elements.degrees.slider("value", $(this).val());
});
//Change slider when input is changed
elements.speed.value.change(function(){
    elements.speed.slider("value", $(this).val());
});
//Change slider when input is changed
elements.perspective.value.change(function(){
    elements.perspective.slider("value", $(this).val());
});

module.exports = elements;
