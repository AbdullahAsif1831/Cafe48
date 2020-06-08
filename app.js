const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
var path = require('path');
//for comments
var express = require("express");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);



// Passport Config
require('./config/passport')(passport);



// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  // Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.student_add_success_msg = req.flash("student_add_success_msg");
  res.locals.student_del_success_msg = req.flash("student_del_success_msg");
  res.locals.student_update_success_msg = req.flash(
    "student_update_success_msg"
  );
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/student.route', require('./routes/student.route'));



//comment system
var Posts = require('./schema/posts');
var Comments = require('./schema/comments');

var port = process.env.port || 5000;


app.use(express.static(__dirname + "/public" ));
app.set('view engine', 'ejs');


app.get('/comments',function(req,res){
    Posts.find({}, function(err, posts) {
        if (err) {
          console.log(err);
        } else {
          res.render('comments', { posts: posts });
        }
    }); 
});


app.get('/posts/detail/:id',function(req,res){
    Posts.findById(req.params.id, function (err, postDetail) {
        if (err) {
          console.log(err);
        } else {
            Comments.find({'postId':req.params.id}, function (err, comments) {
                res.render('post-detail', { postDetail: postDetail, comments: comments, postId: req.params.id });
            });
        }
    }); 
});


// DB connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test')
.then(() => console.log('connection succesful'))
.catch((err) => console.error(err));
// DB connection end


io.on('connection',function(socket){
    socket.on('comment',function(data){
        var commentData = new Comments(data);
        commentData.save();
        socket.broadcast.emit('comment',data);  
    });

});


http.listen(port,function(){
  console.log("Server running at port "+ port);
  });