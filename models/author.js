mongoose = require('mongoose');

var Schema = mongoose.Schema;
var AuthorSchema = new Schema({
	username	: String,
	name		: String,
	password 	: String,
});

AuthorSchema.statics.authenticate = function (username, password, callback) {
  this.findOne({username: username}, function (err, author) {
    console.log(author);
    if (author === null) {
      throw new Error('Can\'t find author with username ' + username);
    } else if (author.checkPassword(password)) {
      callback(null, author);
    }
  });
};

AuthorSchema.methods.checkPassword = function (password) {
  return password == this.password;
};

var Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;