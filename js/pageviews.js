// Endpoint for total number of views per hour
const url = "https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAr8iACgw&format=json"

// This runs once the page is ready to be loaded.
$("document").ready(() => {
    pageviewTotalsPerHour();
    setInterval(pageviewTotalsPerHour, 5000);
});

// Make an HTTP call to the endpoint and update the pageviews element with the new number
const pageviewTotalsPerHour = () => {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'jsonp',
    success: data => {
      const hour = new Date(Date.now()).getHours()
      const pageviews = data.rows[hour][1]
      $('#page-views p').html(pageviews)
    }
  })
}
