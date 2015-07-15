mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
	
var PostSchema = new Schema({
	author		: [{
  			  	    type: Schema.Types.ObjectId, 
  			  	    ref: 'author'
  			  	}],
	date 		: String,
	thoughts	: String,
	comments 	: [{
					text: "string",
					date: String,
					by: Schema.Types.ObjectId
				}]
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;