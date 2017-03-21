var ENDPOINTS = {
  'users': {
    'hour': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAgICACgw&format=json'
  },
  'pageviews': {
    'hour': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAr8iACgw&format=json'
  },
  'articles': {
    'hour': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA7a2SCgw&format=json'
  },
  'currentUsers': {
    'realTime': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA67iPCgw&format=json'
  }
};

// Make an HTTP call to the endpoint and update the pageviews element with the new number
function updatePageviews(time) {
  $.ajax({
    type: 'GET',
    url: ENDPOINTS.pageviews.hour,
    dataType: 'jsonp',
    success: function(data) {
      var hour = new Date().getHours();
      var pageviews = data.rows[hour][1];
      $('#page-views > p').html(pageviews);
    }
  });
}

function updateUsers(time) {

  var $usersite = $('#user-visits > p');

  $(function() {
    $.ajax({
      type: 'GET',
      url: ENDPOINTS.users.hour,
      dataType: 'jsonp',
      success: function(data) {
        var hour = new Date().getHours();
        $('#user-visits > p').html(data.rows[hour][1]);
      }
    });
  });
}

function updateCurrentUsers() {
  $.ajax({
    type: 'GET',
    url: ENDPOINTS.currentUsers.realTime,
    dataType: 'jsonp',
    success: function(data) {
      var lastElemRows = data.rows.length - 1;
      var currentUsers = data.rows[lastElemRows][3];
      $('#current-users > p').html(currentUsers);
    }
  });
}

function updateArticles(time) {

  $.ajax({
    type: 'GET',
    url: ENDPOINTS.articles.hour,
    dataType: 'jsonp',
    success: function(data) {
      renderHTML(data.rows);
    }
  });

  function renderHTML(data) {
    var date = new Date();
    var hour = date.getHours();
    var title, views;

    var i = 1;
    var counter = 0;

    while (i < 6 && counter < data.length) {
      title = data[counter][0];
      views = data[counter][3];
      article_hour = parseInt(data[counter][2]);
      if (article_hour == hour) {
        $("#article-title-"+ i).html(i + ". " + title);
        $("#article-view-" + i).html(views + "  <i class=\"fa fa-eye\" aria-hidden=\"true\"></i>");
        i++;
      }
      counter++;
    }
    
  }
}


function updateClock() {
  var curTime = new Date();

  var curDate = moment().format('dddd MMMM Do YYYY');
  var curTime = moment().format('h:mm a');

  $('#date').html(curDate);
  $('#time > span').html(curTime);
}

function updateData(time) {
  updateUsers(time);
  updatePageviews(time);
  updateArticles(time);
  updateCurrentUsers();
}

function updateTimePeriod(time) {
  switch(time) {
    case "hour":
      return "day";
    case "day":
      return "week";
    default:
      return "hour";
  }
}

// This runs once the page is ready to be loaded.
$(document).ready(function() {
  time = "week";
  updateData(time);
  setInterval(updateData, 5000);

  updateClock();
  setInterval(updateClock, 1000);

  setInterval(function() {
    time = updateTimePeriod(time);
  }, 15000);
});
