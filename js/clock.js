function updateClock() {
  var curTime = new Date();

  var curDate = moment().format('dddd MMMM Do YYYY');
  var curTime = moment().format('h:mm a');

  $('#date').html(curDate);
  $('#time > span').html(curTime);
}

$('document').ready(function() {
  setInterval(updateClock, 1000);
});
