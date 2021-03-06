var ENDPOINTS = {
  'users': {
    'hour': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA67iPCgw&format=json',

    'day': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA3uqJCgw&format=json',

    'week': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA3uqJCgw&format=json'
  },
  'pageviews': {
    'hour': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAr8iACgw&format=json',

    'day': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAgOSRCgw&format=json',

    'week': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAgOSRCgw&format=json'
  },
  'articles': {
    'hour': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA7a2SCgw&format=json',

    'day': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA7bGDCQw&format=json',

    'week': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA7bGDCQw&format=json'
  },
  'currentUsers': {
    'realTime': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA67iPCgw&format=json'
  }
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* Make an HTTP call to the endpoint and update the pageviews element with the new number.
 * Filters the proxy to grab appropriate time frames, then sums up the values.
 */
function updatePageviews(time) {
  $.ajax({
    type: 'GET',
    url: ENDPOINTS.pageviews[time],
    dataType: 'jsonp',
    jsonpCallback: 'callbackPageviews',
    success: function(data) {
      renderHTML(data.rows, time);
    }
  });

  function renderHTML(data, time) {
    var date = new Date();
    var day = date.getDay();
    var dayOfMonth = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();

    switch(time) {
        // Uses the past day JSON data and filters pageviews from past 60 minutes.
      case "hour":
        var filtered = data.filter(function (a) {
          var viewHour = Number(a[0]);
          var viewMinute = Number(a[1]);
          return (viewHour === hour-1 && viewMinute >= minute || viewHour === hour);
        });
        break;
        // Uses the past week JSON data and filters pageviews from past 24 hours based on day of the month.
      case "day":
        var filtered = data.filter(function (a) {
          var viewHour = Number(a[0]);
          var viewDate = Number(a[2]);
          return (viewDate === dayOfMonth-1 && viewHour >= hour || viewDate === date);
        });
        break;
        // Uses the past week JSON data. No filter required.
      default:
        var filtered = data;
    }

    // Adds the page views together.
    var toPrint = sumOfFiltered(filtered, time);
    $('#page-views p').html(numberWithCommas(toPrint));


    function sumOfFiltered(filtered, time) {
      var i;
      var j = 0;
      var viewColumn;

      // API columns are organized differently. This selects the pageviews column.
      switch (time) {
        case "hour":
          viewColumn = 2;
          break;
        default:
          viewColumn = 3;
          break;
      }

      for (i = 0; i < filtered.length; i++) {
        j += Number(filtered[i][viewColumn]);
      }
      return j;
    }
  }
}

/* Make an HTTP call to the endpoint and update the users element with the new number.
 * Filters the proxy to grab appropriate time frames, then sums up the values.
 */
function updateUsers(time) {
  $.ajax({
    type: 'GET',
    url: ENDPOINTS.users[time],
    dataType: 'jsonp',
    success: function(data) {
      renderHTML(data.rows, time);
    }
  });

  function renderHTML(data, time) {
    var date = new Date();
    var day = date.getDay();
    var dayOfMonth = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();

    switch (time) {
        // Uses the past day JSON data and filters pageviews from the last 60 minutes.
      case "hour":
        var filtered = data.filter(function (a) {
          var viewHour = Number(a[1]);
          var viewMinute = Number(a[2]);
          return (viewHour === hour-1 && viewMinute >= minute || viewHour === hour);
        })
        break;
        // Uses the past week JSON data and filters users from past 24 hours based on day of the month.
      case "day":
        var filtered = data.filter(function (a) {
          var viewHour = Number(a[2]);
          var viewDate = Number(a[1]);
          return (viewDate === dayOfMonth-1 && viewHour >= hour || viewDate === date);
        })
        break;
        // Uses the past week JSON data. No filter required.
      default:
        var filtered = data;
    }

    // Adds the users together.
    var toPrint = sumOfFiltered(filtered);

    $('#user-visits p').html(numberWithCommas(toPrint));

    function sumOfFiltered(filtered) {
      var i;
      var j = 0;
      var viewColumn;

      for (i = 0; i < filtered.length; i++) {
        j += Number(filtered[i][3]);
      }
      return j;
    }
  }
}


function updateCurrentUsers() {
  $.ajax({
    type: 'GET',
    url: ENDPOINTS.currentUsers.realTime,
    dataType: 'jsonp',
    jsonpCallback: 'callbackCurrentUsers',
    success: function(data) {
      var lastElemRows = data.rows.length - 1;
      var currentUsers = data.rows[lastElemRows][3];
      $('#current-users p').html(numberWithCommas(currentUsers));
    }
  });
}

/* Filters the articles to grab the appropriate ones for the alloted time slot.
 * Sums the views of those articles, then sorts by view count, then updates the HTML.
 */
function updateArticles(time) {
  $.ajax({
    type: 'GET',
    url: ENDPOINTS.articles[time],
    dataType: 'jsonp',
    jsonpCallback: 'callbackArticles',
    success: function(data) {
      renderHTML(data.rows, time);
    }
  });

  function renderHTML(data, time) {
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    var minute = date.getMinutes();

    switch(time) {
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
        $("#article-title-"+ i).html(title);
        $("#article-view-" + i).html(numberWithCommas(views));
      }
    }
  }
}

function updateStatsTimeRangeDisplay(time) {
  switch(time) {
    case "hour":
      $('.time-interval').text("60 minutes");
      break;
    case "day":
      $('.time-interval').text("24 hours");
      break;
    case "week":
      $('.time-interval').text("7 days");
      break;
  }
}


function updateClock() {
  var curTime = new Date();

  var curDate = moment().format('dddd, MMMM Do, YYYY');
  var curTime = moment().format('h:mm a');

  $('#date').html(curDate);
  $('#time > span').html(curTime);
}

function updateData(time) {
  updateUsers(time);
  updatePageviews(time);
  updateArticles(time);
  updateCurrentUsers();
  updateStatsTimeRangeDisplay(time);
}

function updateTimePeriod(time) {
  switch(time) {
    case "hour":
      return "day";
    case "day":
      return "week";
    case "week":
      return "hour";
  }
}

// This runs once the page is ready to be loaded.
$(document).ready(function() {
  var time = "week";
  updateData(time);
  setInterval(function() {
    updateData(time);
  }, 15000);

  updateClock();
  setInterval(updateClock, 1000);

  setInterval(function() {
    time = updateTimePeriod(time);
  }, 15000);
});
