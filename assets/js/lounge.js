var lounge = angular.module('lounge', []);

var elems = document.getElementById('questions');

//get cookie username
    var allCookies = document.cookie;
    //split cookie array
    var cookieArray = allCookies.split(';');
    for(var i = 0; i < cookieArray.length; i++){
        var username = cookieArray[i].split('=')[1];
    }
    //console.log('Username is: ' + username);

lounge.controller('loungeCtrl', function($scope, $http){
    $scope.username = username;
    
    $http.get('/getData/member').success(function(res){
        if(res.length > 0){
    
            for(var i = 0; i < res.length; i++){
            
                    elems.insertAdjacentHTML('afterBegin', '<li class="listOfcurrentQuestions" data-category="' + 
                                             res[i].categories + '"><a href=\'/one-question-members/' + 
                                             res[i].ques + '\'>' + 
                                             res[i].ques + 
                                             '</a></li>');
            }
        }else{
            //if there's no question for the day, post a default message
            elems.insertAdjacentHTML('afterBegin', '<li>There are no questions posted today.</li>');
        }
    });//end /getData
    
    //put all categories in an array. to be maintainable if there's an expansion/modification
    //this is working
    $scope.categories = [{name: 'Science and Technology'},
                         {name: 'Business'},
                         {name: 'Personal'},
                         {name: 'Social'},
                         {name: 'Employment'}];
    
    //should sort/map the array of today's questions based on category
    $scope.update = function(){
        
        //get all <li> with data-categories != selected value. should return an array if successful
        var UnselectedElems = document.querySelectorAll('li.listOfcurrentQuestions:not([data-category="' + $scope.category.name + '"])');
        if(UnselectedElems.length > 0){
            //hide all elements which are not of the selected category
            for(var i = 0; i < UnselectedElems.length; i++){
                //hide all elements which are not of the selected category
                UnselectedElems[i].style.display = "none";
            }
        }
        
        //get all <li> with data-categories == selected value. should return an array if successful
        var selectedElems = document.querySelectorAll('li.listOfcurrentQuestions[data-category="' + $scope.category.name + '"]');
        
        if(selectedElems.length > 0){
            //check if #noResultCategory exists. if it does, remove it
            var noResult = document.getElementById('noResultCategory');
            if(noResult){
               elems.removeChild(noResult) ;
            }
            
            for(var i = 0; i < selectedElems.length; i++){
                //show all elements which are of the selected category
                selectedElems[i].style.display = "block";
            }
        }else{
            //selected category returns null. create <li> to contain default message
            if(!document.getElementById('noResultCategory')){
                var noResultLi = document.createElement('li');
                noResultLi.setAttribute('id', 'noResultCategory');
                var defaultMsg = document.createTextNode('There are no questions with that category.');
                noResultLi.appendChild(defaultMsg);

                elems.appendChild(noResultLi);
            }
        }
        
        
    }
    
});// end loungeCtrl






































