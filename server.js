// SERVER-SIDE JAVASCRIPT

// require express framework and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    session = require('express-session'),
    mongoose = require('mongoose');

// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	secret: 'super-secret',
	resave: false,
	saveUninitialized: true
}));

mongoose.connect('mongodb://localhost/blog/');

// brings in the exports from the post.js file
var Post = require('./models/post');

// brings in the export from the author.js file
var Author = require('./models/author');

// brings in the export from the comment.js file
var Comment = require('./models/comment');

// var posts = [
// 	{id: 1, user: "Amanda", date: 'Sun Jul 12 2015 21:57:30 GMT-0700 (PDT)', thoughts: "Working on it"},
// 	{id: 2, user: "Amelia", date: 'Sun Jul 12 2015 21:57:30 GMT-0700 (PDT)', thoughts: "Frogs"}
// ];

// ROUTES
// root route (serves index.html)
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// authentication
app.get('/login', function (req, res) {
  // ideally you would put this html variable in it's own .html file
  var html = '<form action="/sessions" method="post">' +
               'Your username: <input type="text" name="username"><br>' +
               'Your password: <input type="text" name="password"><br>' +
               '<button type="submit">Submit</button>' +
               '</form>';
  if (req.session.user) {
    html += '<br>Your username from your session is: ' + req.session.user.username;
  }
  console.log(req.session);
  res.send(html);
});

app.post('/sessions', function (req, res) {
  Author.authenticate(req.body.username, req.body.password, function(error, author) {
    req.session.author = author;
    res.redirect('/login');
  });
});

// posts index
app.get('/posts', function(req, res) {
  // find all posts in db
  Post.find(function(err, posts) {
  	// send all posts as JSON response
  	res.json(posts);
  });
});

// finds one post
app.get('/posts/:id', function(req, res) {
  // set value of post id
  var targetId = req.params.id;

  // find post by id
  Post.findOne({_id: targetId}, function(err, foundPost) {
  	// send all posts as JSON response
  	res.json(foundPost);
  });
});

// create new post
app.post('/posts', function(req, res) {
  // grab params from form data

  var newPost = new Post({
  	user: req.body.author,
  	thoughts: req.body.thoughts,
  	date: req.body.date,
  });

  // save new post in db
  newPost.save(function(err, savedPost) {
  	res.json(savedPost);
  });
});

// update post
app.put('/posts/:id', function(req, res) {

  // set the value of the id
  var targetId = req.params.id;

  // find item in `posts` array matching the id
  Post.findOne({_id: targetId}, function(err, foundPost) {
  	// update the post's author, thoughts, and date
  	foundPost.author = req.body.author;
  	foundPost.thoughts = req.body.thoughts;
  	foundPost.date = req.body.date;

  	// save edited post in db
  	foundPost.save(function(err, savedPost) {
  		res.json(foundPost);
  	});
  });
});

// delete post
app.delete('/posts/:id', function(req, res) {
  
  // set the value of the id
  var targetId = req.params.id;

  // find item in `posts` array matching the id
  Post.findOneAndRemove({_id: targetId}, function(err, deletedPost) {
  	res.json(deletedPost);
  });
});


// listen on port 3000
app.listen(3000, function() {
  console.log('server started on localhost:3000');
});