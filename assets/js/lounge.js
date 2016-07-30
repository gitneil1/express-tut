var lounge = angular.module('lounge', []);

var elems = document.getElementById('questions');

//get cookie username
    var allCookies = document.cookie;
    //split cookie array
    var cookieArray = allCookies.split(';');
    for(var i = 0; i < cookieArray.length; i++){
        var username = cookieArray[i].split('=')[1];
    }
    console.log('Username is: ' + username);

lounge.controller('loungeCtrl', function($scope, $http){
    //console.log('welcome');
    
    $scope.username = username;
    
    $http.get('/getData/member').success(function(res){
    
        if(res.length > 0){
    
            for(var i = 0; i < res.length; i++){
            
                    elems.insertAdjacentHTML('afterBegin', '<li><a href=\'/one-question-members/' + res[i].ques + '\'>' + res[i].ques + '</a></li>');
            }
    
        }else{
            $scope.ques = "none";
        }
    });//end /getData    
    
});// end loungeCtrl

function sortBy(){
        alert('called sortBy()');
    }






































