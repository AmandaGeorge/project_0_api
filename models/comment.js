mongoose = require('mongoose');

var Schema = mongoose.Schema;
var CommentSchema = new Schema({
	post	: [{
  			      type: Schema.Types.ObjectId, 
  			      ref: 'post'
  			  }],
	author	: String,
	date 	: String,
	text	: String,
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;