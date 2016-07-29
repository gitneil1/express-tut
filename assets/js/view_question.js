var viewQuestion = angular.module('viewQuestion', []);
var objQues = document.getElementById('objQues').value;

viewQuestion.controller('viewQuestionCtrl', function($scope, $http){
    
    //$scope.test = "Discipline is the mother of all skill. " + objQues;
    
    $scope.objInfo = {};
    
    $scope.comments = [];
    
    $http.get('/getQuestionObj/' + objQues).success(function(res){
        
        if(res.length > 0){
        
            for(var i = 0; i < res.length; i++){
                $scope.objInfo.ques = res[i].ques;
                $scope.objInfo.email = res[i].email;
                $scope.objInfo.date = res[i].date;
                $scope.objInfo.time = res[i].time;
                
                if(res[0].Comments.length > 0){        
                    for(var i = 0; i < res[0].Comments.length; i++){

                    $scope.comments.push({message: res[0].Comments[i].comment.message, 
                                          commenter: res[0].Comments[i].comment.commenter, 
                                          date: res[0].Comments[i].comment.date, 
                                          time: res[0].Comments[i].comment.time});

                }
                }else{
                    console.log('There are no comments');
                }
            }
            
        }else{
            console.log('something\'s wrong');
        }
        
    });
});//end viewQuestionCtrl controller



























