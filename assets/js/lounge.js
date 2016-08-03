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
    
    $scope.username = username;
    $scope.testingCode = '00';
    
    $http.get('/getData/member').success(function(res){
        //not working -> testingCode
        $scope.testingCode = "in getData";
        if(res.length > 0){
    
            for(var i = 0; i < res.length; i++){
            
                    elems.insertAdjacentHTML('afterBegin', '<li class="listOfcurrentQuestions" data-category="' + res[i].categories + '"><a href=\'/one-question-members/' + 
                                             res[i].ques + '\'>' + 
                                             res[i].ques + 
                                             '</a></li>');
            }
        }else{
            $scope.ques = "none";
        }
    });//end /getData
    
    console.log('value of testingCode: ' + $scope.testingCode);
    
    //put all categories in an array. to be maintainable if there's an expansion/modification
    //this is working
    $scope.categories = [{name: 'Science and Technology'},
                         {name: 'Business'},
                         {name: 'Personal'},
                         {name: 'Social'},
                         {name: 'Employment'}];
    
    //should sort/map the array of today's questions based on category
    $scope.update = function(){
        //get all <li> with data-categories == selected value. should return an array if successful
        var selectedElems = document.querySelectorAll('li.listOfcurrentQuestions[data-category="' + $scope.category.name + '"]');
        for(var i = 0; i < selectedElems.length; i++){
                //show all elements which are of the selected category
                selectedElems[i].style.display = "block";
            }
        
        //get all <li> with data-categories != selected value. should return an array if successful
        var UnselectedElems = document.querySelectorAll('li.listOfcurrentQuestions:not([data-category="' + $scope.category.name + '"])');
        if(UnselectedElems.length > 0){
            //hide all elements which are not of the selected category
            for(var i = 0; i < UnselectedElems.length; i++){
                //hide all elements which are not of the selected category
                UnselectedElems[i].style.display = "none";
            }
        }
        
    }
    
});// end loungeCtrl






































