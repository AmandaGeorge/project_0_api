$(document).ready(function() {
	console.log("working js");

	var $form = $("#add-post-form");
	var $feed = $("#feed");

	var $userName = $("#user");
	var $thoughts = $("#thoughts");
	var $submit = $("#submitPost");
	var counter = 0;

	//To compile the template
	var _postTemplate = _.template($("#post-template").html());

	var testPosts = [
		{user: "Amanda", toughts: "Working on it"},
		{user: "Amelia", toughts: "Frogs"}
	];

	//Post constructor
	function Post(user, thoughts, date) {
		this.user = user;
		this.date = date;
		this.thoughts = thoughts;

		// this.items = localStorage.getItem("posts");
		// this.key = "posts";
	}

	Post.all_posts = [];

	// function SaveRender() {
	// 	var myPost = new Post($userName.val(), $thoughts.val());
	// 	myPost.saveToLs;
	// 	myPost.renderTemplate;

	// 	// $modal[0].reset();
	// 	// $("#user").focus();
	// }

	Post.prototype.save = function() {
		// console.log("saving to LS");
		// if (this.items) {
		// 	items_json = JSON.parse(this.items);
		// } else {
		// 	items_json = [];
		// }
		// items_json.push(item);
		// localStorage.setItem(this.key, JSON.stringify(items_json));
		Post.all_posts.push(this);
	}

	Post.prototype.renderTemplate = function() {
		// console.log("rendering template");
		// var items_json = JSON.parse(this.items);
		// var template = _.template($(template_source).html());

		// _.each(items_json, function(item) {
		// 	$(where).append(template(item));
		// });
		var $post = $(_postTemplate(this));
		$feed.prepend($post);
	}

	// Post.prototype = new SaveRender();
	// Post.prototype.constructor = Post;

	// var post1 = new Post("Amanda", "Does this work?");
	// post1.saveToLs(post1);
	// post1.renderTemplate("#post-template", "#feed");

	// ALL BELOW IS INSPIRED BY THE TODO APP
	// Post.all_posts = [];

	// Post.prototype.save = function() {
	// 	Post.all_posts.push(this);
	// }

	// Post.prototype.render = function() {
	// 	var $post = $(_postTemplate(this));
	// 	$feed.prepend($post);
	// }

	$("#add-post-modal").on("shown.bs.modal", function() {
	  $(this).find("input:first").focus();
	});

	$form.on("submit",
		function(event) {
			event.preventDefault();
			console.log("i got clicked");
			// event.preventDefault();
			// SaveRender();
			var utcSeconds = Date.now();
			var date = new Date(utcSeconds);
			var myPost = new Post($userName.val(), $thoughts.val(), date);
			myPost.save();
			myPost.renderTemplate();

			$("#add-post-modal").modal("hide");
			
			// $form.reset();
			// $("#item-name").focus();

			counter += 1;
			$("#footer").html("Total posts: " + counter);
		}
	);

})