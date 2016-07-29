
/*
var questions = require('./questions_controller');

if(questions.length > 0){
    console.log('questions ok');
}*/
//populate listQuestions class with links
    var populateAnchor = function(){
        var elems = document.getElementsByClassName('listQuestions');
        var qValue = document.getElementById('qq');
        if(elems.length > 0){
            console.log('elems count: ' + elems.length);
            console.log('elems content: ' + elems.value);
        }else
            console.log('no doc selected');
        
        /*for(var i = 0; i < qValue.length; i++){
            console.log('qValue: ' + qValue[i].text);
        }*/

        for(var i = 0; i < elems.length; i++){
            elems[i].insertAdjacentHTML('afterBegin', '<a>click</a>');
        }
    }
    
    populateAnchor();
    
