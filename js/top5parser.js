function updateTopArticles() {


  var url = 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICA7a2SCgw&format=json';

  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'jsonp',
    success: function(data) {
      renderHTML(data.rows);
    }
  });

  function renderHTML(data) {
    var date = new Date(Date.now());
    var hour = date.getHours();
    var title = '';
    var views = '';
    var i = 1;
    var counter = 0;

    while (i < 6) {
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

$('document').ready(function() {
  updateTopArticles();
  setInterval(updateTopArticles, 5000);
});
