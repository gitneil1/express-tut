var questions = angular.module("questions", []);

var elems = document.getElementById('questions');



questions.controller('questionCtrl', function($scope, $http){
    
    
    $http.get('/getData/visitor').success(function(res){
        
        if(res.length > 0){
            for(var i = 0; i < res.length; i++){
                
                //commented... using id doesnt work at the time
                //elems.insertAdjacentHTML('afterBegin', '<li><a href=\'/one-question/' + res[i]._id + 
                                         //'\'>' + res[i].ques + '</a></li>');
                elems.insertAdjacentHTML('afterBegin', '<li><a href=\'/one-question/' + res[i].ques + 
                                         '\'>' + res[i].ques + '</a></li>');
                
                //for testing
                //<a href="javascript:deleteContact({{nid}})
            } 
            
        }else{
            $scope.ques = "None";
        }
        
    });//end /getData
    
});//end controller

