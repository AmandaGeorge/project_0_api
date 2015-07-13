// CLIENT-SIDE JAVASCRIPT

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

	//Post constructor
	function Post(user, thoughts, date) {
		this.user = user;
		this.thoughts = thoughts;
		this.date = date;

	}

	Post.all_posts = [];

	// Prototypes
	Post.prototype.save = function() {
		Post.all_posts.push(this);
	}

	Post.prototype.renderTemplate = function() {
		var $post = $(_postTemplate(this));
		$feed.prepend($post);
	}

	$("#add-post-modal").on("shown.bs.modal", function() {
	  $(this).find("input:first").focus();
	});

	$form.on("submit",
		function(event) {
			event.preventDefault();
			console.log("i got clicked");
	
			var utcSeconds = Date.now();
			var date = new Date(utcSeconds);
			var myPost = new Post($userName.val(), $thoughts.val(), date);
			myPost.save();
			myPost.renderTemplate();

			$("#add-post-modal").modal("hide");

			counter += 1;
			$("#footer").html("Total posts: " + counter);
		}
	);

	var all = function() {
      $.get('/api/posts', function(data) {
        var allPosts = data;
        
        // iterate through allPosts
        _.each(allPosts, function(post) {
          // pass each post object through template and append to view
          var $postHtml = $(_postTemplate(post));
          $feed.append($postHtml);
        });
        // add event-handlers to posts for updating/deleting
        addEventHandlers();
      });
    };

    var create = function(newUser, newThoughts) {
    	var postData = {user: newUser, thoughts: newThoughts, date: newDate};
    	//send POST request to server to create new post
    	$.post('api/posts', postData, function(data) {
    		//pass post object through template and append to view
    		var $postHtml = $(_postTemplate(data));
    		$feed.append($postHtml);
    	});
    };

    var update = function(postId, updatedUser, updatedThoughts, updatedDate) {
    	$.ajax({
    		type: 'PUT',
    		url: 'api/posts' + postId,
    		data: {
    			user: updatedUser,
    			thoughts: updatedThoughts,
    			date: updatedDate
    		},
    		success: function(data) {
    			//pass post object through template and append to view
    			var $postHtml = $(_postTemplate(data));
    			$feed.append($postHtml);
    		}
    	});
    };

    var gone = function(postId) {
    	//send DELETE request to server to delete post
    	$.ajax({
    		type: 'DELETE',
    		url: 'api/posts/' + postId,
    		success: function(data) {
    			//remove deleted post from view
    			$('#post-' + postId).remove();
    		}
    	});
    };

})