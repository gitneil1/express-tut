var express = require('express');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('forum_users', ['forum_users']);
var db_questions = mongojs('forum_questions', ['forum_questions']);

app.disable('x-powered-by');

var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('body-parser').urlencoded({ extended: true}));

var formidable = require('formidable');

var session = require('express-session');

var parseUrl = require('parseurl');

var credentials = require('./credentials');
app.use(require('cookie-parser')(credentials.cookieSecret));

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/assets/js'));
app.use('/css', express.static(__dirname + '/assets/css'));

app.get('/', function(req, res){
    res.render('home');
});

app.get('/getData/:account', function(req, res){
    //if account is member, get data that is for today only
    var account = req.params.account;
    
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    
    var dateNow = month + '/' + day + '/' + year;
    
    if(account === "member"){
        db_questions.forum_questions.find({date: dateNow},function(err, docs){
        res.json(docs);   
        });
    }else{
        db_questions.forum_questions.find(function(err, docs){
            res.json(docs);   
        });
    }
});

app.use(function(req, res, next){
    console.log('Looking for URL: ' + req.url);
    next();
});


//use middleware to declare variable that will hold data from forum_questions
/*app.use(function(req, res, next){ 7/21
    console.log('declaring forumQuestions global variable');
    req.myForum = {name: "neil"};
    next();
});*/

app.get('/about', function(req, res){
    res.render('about');
});

app.get('/contact', function(req, res){
    res.render('contact', { csrf: 'CSRF token here'});
});

app.get('/thankyou', function(req, res){
    res.render('thankyou');
});

app.get('/signin', function(req, res){
    res.render('signin');
});

app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: credentials.cookieSecret
        }));

app.use(function(req, res, next){
    var views = req.session.views;
    if(!views)
        views = req.session.views = {};
    
    var pathname = parseUrl(req).pathname;
    
    views[pathname] = (views[pathname] || 0) + 1;
    
    next();
});

app.use(function(req, res, next){
    var user = req.session.user;//declare req.session.user to be used later
    next();
});

app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    
    db.forum_users.find({username: username}, function(err, doc){
        
        if(doc.length > 0){
            for(var i = 0; i < doc.length; i++){
                if(password === doc[i].password){
                    console.log('ok to log');
                    req.session.user = username;
                    //res.cookie('username', username);
                    
                    res.redirect('lounge');
                }else{
                    console.log('wrong username/password');
                    res.redirect('signin');
                }
            }
        }else{
            console.log('wrong username/password');
            res.redirect('signin');
        }
    });
});

app.get('/lounge', function(req, res){
    if(req.session.user == undefined){ 
        console.log('Username: undefined. Redirecting to signin');
        res.redirect('signin');
    }else{
        //set cookie for user
        res.cookie('username', req.session.user);
        res.render('lounge');
    }
});

//go to individual question to see full question detail
app.get('/one-question/:question_ques', function(req, res){
    //commented... id doesnt work at the time
    //var qId = req.params.question_id;
    
    //store qId to global variable
    //req.myForum.questionId = qId;
    
    var qQues = req.params.question_ques;
    //req.myForum.question = qQues;
    //console.log('question : ' + req.myForum.question);
    
    var questionObj = {};
    /*
    db_questions.forum_questions.find({"_id": qId},function(err, doc){
        
        if(err)
            console.log(err.message);
        for(var i = 0; i < doc.length; i++){
            console.log('got one');
            console.log(doc[i]._id + " " + doc[i].ques);
        }
    });
    
    
    db_questions.forum_questions.find({"ques": qQues},function(err, doc){
        if(err)
            console.log(err.message);
        
        for(var i = 0; i < doc.length; i++){
            console.log('got one');
            console.log(doc[i]._id + " --> " + doc[i].ques);
            //store data in global variable
            questionObj.id = doc[i]._id;
            questionObj.email = doc[i].email;
            questionObj.ques = doc[i].ques;
        }
    });
    */
    
    //display data (for testing)
    //console.log('ques: ' + questionObj.ques);//'undefined' if placed outside db.find()
    res.render('one-question', {number: qQues});
});

//for members only
app.get('/one-question-members/:ques', function(req, res){
    if(req.session.user == undefined){ 
        console.log('Username: undefined. Redirecting to signin');
        res.render('signin');
    }else{
        //set cookie for user
        res.cookie('username', req.session.user);
        res.render('one-question-members', {ques: req.params.ques});
    }
    //var qQues = req.params.ques;
    //res.render('one-question-members', {ques: qQues});
});

//req.myForum.questionObj should be here
app.get('/getQuestionObj/:question', function(req, res){
    var ques = req.params.question;
    console.log('fetching question obj: ' + ques);
    
    db_questions.forum_questions.find({"ques": ques},function(err, doc){
        if(err)
            console.log(err.message);
        res.json(doc);
    });
});

app.post('/validateInfo', function(req, res){
    var username = req.body.username;
    
    db.forum_users.find({username: username}, function(err, doc){
        
        if(doc.length > 0){
            console.log('Username already exists.');
            res.render('register');
        }else{
            console.log('username ok');
            db.forum_users.insert(req.body, function(err, doc){
                res.redirect('thankyou');
            });
        }
    });
});

app.post('/process', function(req, res){
    console.log('Form : ' + req.query.form);
    console.log('CSRF token : ' + req.body._csrf);
    console.log('Email : ' + req.body.email);
    console.log('Question : ' + req.body.ques);
    console.log('Category: ' + req.body.categories);
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var date1 = month + "/" + day + "/" + year;
    console.log('Date posted: ' + date1);
    req.body.date = date1;
    
    var hour = now.getHours();
    var minute = now.getMinutes();
    var time = hour + ":" + minute;
    req.body.time = time;
    
    db_questions.forum_questions.insert(req.body, function(err, doc){
       console.error(err); 
    });
    
    res.redirect(303, '/thankyou');
});

//submit comments here
app.post('/submit_comment', function(req, res){
    //add date and time to comments
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var date1 = month + '/' + day + '/' + year;
    
    var hour = now.getHours();
    var minute = now.getMinutes();
    var time = hour + ':' + minute;
    
    db_questions.forum_questions.update({ques: req.body.commentedQuestion}, {$push: {"Comments": {"comment":{message: req.body.message, commenter: req.body.commenter, date: date1, time: time}}}});
    
    //send user to the same page to reload
    res.redirect('/one-question/' + req.body.commentedQuestion);
});

app.post('/submit_comment_members', function(req, res){
    //add date and time to comments
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var date1 = month + '/' + day + '/' + year;
    
    var hour = now.getHours();
    var minute = now.getMinutes();
    var time = hour + ':' + minute;
    
    db_questions.forum_questions.update({ques: req.body.commentedQuestion}, {$push: {"Comments": {"comment":{message: req.body.message, commenter: req.session.user, date: date1, time: time}}}});
    //send user to the same page to reload
    res.redirect('/one-question-members/' + req.body.commentedQuestion);
});

//get comments for the question if there's any
app.get('/getCommentsList/:ques', function(req, res){
    var ques = req.params.ques;
    console.log('getting comments from question: ' + ques);
    
    db_questions.forum_questions.find({"ques": ques},function(err, doc){
        if(err)
            console.log(err.message);
        console.log("Got result from db " + doc[0].ques);
        res.json(doc);
    });
})

app.get('/logout', function(req, res){
    req.session.destroy(function(err){
        if(err){ 
            console.log(err)
        }else{
            res.render('thankyou');
        }
        
    });
    
    //res.clearCookie('username');
    //res.render('thankyou');
})
/* 7/21
app.get('/file-upload', function(req, res){
    
    var now = new Date();
    res.render('file-upload', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});

app.get('/file-upload/:year/:month', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, field, file){
        if(err)
            return res.redirect(303, '/error');
        console.log('Received file');
        console.log(file);
        res.redirect(303, '/thankyou');
    });
});

app.get('/cookie', function(req, res){
    res.cookie('username', 'Neil Agor', { expire: new Date() + 9999}).send('username is Neil Agor');
});

app.get('/listcookies', function(req, res){
    console.log('Cookies : ' + req.cookies);
    res.send('Look into console for cookies');
});

app.get('/deletecookie', function(req, res){
    res.clearCookie('username');
    res.send('cookie deleted');
});

app.get('/viewcount', function(req, res, next){
    res.send('View page count: ' + req.session.views['/viewcount']);
});

var fs = require('fs');

app.get('/readfile', function(req, res){
    fs.readFile('./public/random.txt', function(err, data){
        if(err){ return console.error(err)}
        
        res.send('File content: ' + data.toString());
    });
});

app.get('/writefile', function(req, res, next){
    fs.writeFile('./public/goody.txt', 'Goody work. Goody work', function(err){
        if(err){ return console.error(err);}
    });
    
    fs.readFile('./public/goody.txt', function(err, data){
        if(err){ return console.error(err)}
        
        res.send('File content: ' + data.toString());    
    });
});
*/
app.get('/register', function(req, res, next){
    res.render('register');
})

app.get('/junk', function(req, res, next){
    console.log('Tried to access /junk');
    throw new Error('/junk doesn\'t exist');
});

app.use(function(err, req, res, next){
    console.log('Error: ' + err.message);
    next();
});

app.use(function(req, res){
    res.type('text/html');
    res.status(404);
    res.render('404');
});

app.use(function(err,req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
    next();
});


app.listen(app.get('port'), function(){
    console.log('Server index.js: running...');
});






















