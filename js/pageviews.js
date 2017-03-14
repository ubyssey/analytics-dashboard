// Endpoint for total number of views per hour
var viewsPerHour = "https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAr8iACgw&format=json"

// This runs once the page is ready to be loaded.
$("document").ready(function() {
    pageviewTotalsPerHour();
    setInterval(pageviewTotalsPerHour, 5000);
});

// Make an HTTP call to the endpoint and update the pageviews element with the new number
function pageviewTotalsPerHour() {
  $.ajax({
    type: 'GET',
    url: viewsPerHour,
    dataType: 'jsonp',
    success: function(data) {
      var hour = new Date().getHours()
      var pageviews = data.rows[hour][1]
      $('#page-views p').html(pageviews)
    }
  })
}
