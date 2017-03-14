var ENDPOINTS = {
  'users': {
    'hour': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAgICACgw&format=json'
  },
  'pageviews': {
    'hour': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAr8iACgw&format=json'
  },
  'articles': {
    'hour': 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA7a2SCgw&format=json'
  }
};

// Make an HTTP call to the endpoint and update the pageviews element with the new number
function updatePageviews() {
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

function updateUsers() {

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

function updateArticles() {

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

function updateData() {
  updateUsers();
  updatePageviews()
  updateArticles();
}

// This runs once the page is ready to be loaded.
$(document).ready(function() {
  updateData();
  setInterval(updateData, 5000);
});
