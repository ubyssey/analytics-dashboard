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
        $usersite.append(data.rows[hour][1]);
    }
});
});
}
updateUsersOnSite();
