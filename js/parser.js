
/*
var usersOnSite = document.getElementById("user-site");
*/
var users = 'https://ubyssey-analytics.appspot.com/query?id=ahNzfnVieXNzZXktYW5hbHl0aWNzchULEghBcGlRdWVyeRiAgICAgICACgw&format=json';
var $usersite = $('#usersite');

$(function() {
$.ajax({
    type: 'GET',
    url: 'usersperhour.json',
        xhrFields: {
        withCredentials: true
    },
    success: function(data) {
        var d = new Date();
        var hour = d.getHours();
        var temp = JSON.parse(data);
        $usersite.append(temp.rows[hour][1]);
        console.log(hour);
    }
});
});

