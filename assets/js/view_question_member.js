var viewQuestionMember = angular.module('viewQuestionMembers', []);
var objQues = document.getElementById('objQues').value;

//get cookie username
var allCookies = document.cookie;
//split cookie array
var cookieArray = allCookies.split(';');
var username;
for(var i = 0; i < cookieArray.length; i++){
    username = cookieArray[i].split('=')[1];
}
//console.log('Username is: ' + username);
if(username === undefined){
    console.log('Must redirect to signin');
    //redirection here
}


viewQuestionMember.controller('viewQuestionMemberCtrl', function($scope, $http){
    $scope.username = username;
    
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
            console.log('Result null. Something is wrong.');
        }
    });//end $http.get
});//end viewQuestionMemberCtrl






























