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
    
    //put all categories in an array. to be maintainable if there's an expansion/modification
    //this is working
    $scope.categories = [{name: '-No sort-'},
                         {name: 'Science and Technology'},
                         {name: 'Business'},
                         {name: 'Personal'},
                         {name: 'Social'},
                         {name: 'Employment'}];
    
    //should sort/map the array of today's questions based on category
    $scope.update = function(){
        console.log('Item name: ' + $scope.category.name);
    }
    
});// end loungeCtrl






































