function updateUsersOnSite() {


var users = 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAgICACgw&format=json';
var $usersite = $('#usersite');

$(function() {
$.ajax({
    type: 'GET',
    url: 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAgICACgw&format=json',
	dataType: 'jsonp',
    success: function(data) {
        var d = new Date();
        var hour = d.getHours();
        var temp = JSON.parse(data);
        $usersite.append(temp.rows[hour][1]);
    }
});
});
}
