mongoose = require('mongoose');

var Schema = mongoose.Schema;
var PostSchema = new Schema({
	user: String,
	date: String,
	thoughts: String,
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;