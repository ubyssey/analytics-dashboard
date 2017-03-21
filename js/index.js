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

function updateCurrentUsers(time) {
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

/* Filters the articles to grab the appropriate ones for the alloted time slot.
 * Sums the views of those articles, then sorts by view count, then updates the HTML. 
 */
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
    var day = date.getDay();
    var hour = date.getHours();
    var minute = date.getMinutes();
    switch("hour") {

      // Uses the past day Json file and filters top articles from past 60 minutes.
      case "hour":
        var filtered = data.filter(function (a) {
          var articleHour = Number(a[2]);
          var articleMinute = Number(a[3]);
          return (articleHour === hour-1 && articleMinute >= minute || articleHour === hour);
        });
        break;

      // Uses the past 7 days Json file and filters top articles from past 24 hours.
      case "day":

        var filtered = data.filter(function (a) {
          var articleHour = Number(a[2]);
          var articleDay = Number(a[3]);
          return (articleDay === day-1 && articleHour >= hour || articleDay === day);
        });   
        break;

      // Displays past 7 day's top articles. Does not need to be filtered.
      default:
        var filtered = data;

    }

    // Adds the views together.
    var toPrint = sumOfFiltered(filtered);

    toPrint.sort((function(a,b) {
      return b[4] - a[4];
    }));
    update(toPrint);


    // Adds the views and returns to toPrint.
    function sumOfFiltered(filtered) {
      var i, j;
      toPrint = [];
      for (i = 0; i < filtered.length; i++) {
        var bool = false;
        var title = filtered[i][1];
        for(j = 0; j < toPrint.length; j++) {
          if (toPrint[j][1] === title) {
            bool = true;
            break;
          }
        }
        if (bool) {
          var n = parseInt(toPrint[j][4]) + parseInt(filtered[i][4]);
          toPrint[j][4] = n.toString();
        } else {
          toPrint.push(filtered[i]);
        }
      }
      return toPrint;
    }

    // Updates the HTML.
    function update(toPrint) {
      for (var i = 1; i <= 5; i++) {
        title = toPrint[i-1][1];
        views = toPrint[i-1][4];
        $("#article-title-"+ i).html(i + ". " + title);
        $("#article-view-" + i).html(views + "  <i class=\"fa fa-eye\" aria-hidden=\"true\"></i>");
      }
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
  var time = "week";
  updateData(time);
  setInterval(function() {
    updateData(time);
  }, 5000);

  updateClock();
  setInterval(updateClock, 1000);

  setInterval(function() {
    time = updateTimePeriod(time);
  }, 15000);
});

