// SERVER-SIDE JAVASCRIPT

// require express framework and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    mongoose = require('mongoose');

// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/blog/');

var Post = require('./models/post');

// var posts = [
// 	{id: 1, user: "Amanda", date: 'Sun Jul 12 2015 21:57:30 GMT-0700 (PDT)', thoughts: "Working on it"},
// 	{id: 2, user: "Amelia", date: 'Sun Jul 12 2015 21:57:30 GMT-0700 (PDT)', thoughts: "Frogs"}
// ];

// ROUTES
// root route (serves index.html)
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
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
  	user: req.body.user,
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
  	// update the post's user, thoughts, and date
  	foundPost.user = req.body.user;
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