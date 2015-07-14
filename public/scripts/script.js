// CLIENT-SIDE JAVASCRIPT

$(function() {
	console.log('working js');

    var postsController = {

        //To compile the template
        template: _.template($('#post-template').html()),

        all: function() {
            //send GET request to server to get all posts
            $.get('/posts', function(data) {
                var allPosts = data;

                // iterate through each post
                _.each(allPosts, function(post) {
                    var $postHtml = $(postsController.template(post));
                    $('#feed').prepend($postHtml);
                });
                // add event-handlers to posts for updating/deleting
                postsController.addEventHandlers();
            });
        },

        create: function(newUser, newThoughts, newDate) {
            var postData = {user: newUser, thoughts: newThoughts, date: newDate};
            
            //send POST request to server to create new post
            $.post('/posts', postData, function(data) {
                var $postHtml = $(postsController.template(data));
                $('#feed').prepend($postHtml);
                console.log(postData);
            });
        },

        update: function(postId, updatedUser, updatedThoughts, updatedDate) {
            $.ajax({
                type: 'PUT',
                url: '/posts/' + postId,
                data: {
                    user: updatedUser,
                    thoughts: updatedThoughts,
                    date: updatedDate
                },
                success: function(data) {
                    //replace existing post in view with updated version
                    var $postHtml = $(postsController.template(data));
                    $('#post-' + postId).replaceWith($postHtml);
                }
            });
        },

        delete: function(postId) {
            //send DELETE request to server to delete post
            $.ajax({
                type: 'DELETE',
                url: '/posts/' + postId,
                success: function(data) {
                    //remove deleted post from view
                    $('#post-' + postId).remove();
                }
            });
        },

        addEventHandlers: function() {
            $('#feed')

                //for update: submit event on udpate-post form
                .on('submit', '.update-post-form', function(event) {
                    event.preventDefault();

                    //find the post's id (stored as 'data-id')
                    var postId = $(this).closest('.post').attr('data-id');

                    //update the post with form data
                    var updatedUser = $(this).find('.updated-user').val();
                    var updatedThoughts = $(this).find('.updated-thoughts').val();
                    var utcSeconds = Date.now();
                    var updatedDate = new Date(utcSeconds);
                    postsController.update(postId, updatedUser, updatedThoughts, updatedDate);
                    console.log(postId, updatedUser, updatedThoughts, updatedDate);
                })

                .on('click', '.delete-post-button', function(event) {
                    event.preventDefault();

                    //find the post's id (stored as 'data-id')
                    var postId = $(this).closest('.post').attr('data-id');

                    //delete the post
                    postsController.delete(postId);
                })
        },

        setupView: function() {
            //append existing posts to view
            postsController.all();

            //add event handler to new post modal
            $('#add-post-modal').on('shown.bs.modal', function() {
                $('#user').focus();
            });

            //add event-handler to new post form ($form)
            $('#add-post-form').on('submit', function(event) {
                event.preventDefault();
                console.log('i got clicked');
                
                //create new post with form data
                var newUser = $('#user').val();
                var newThoughts = $('#thoughts').val();
                var utcSeconds = Date.now();
                var newDate = new Date(utcSeconds);
                postsController.create(newUser, newThoughts, newDate);

                //to hide the modal after submitting a new post
                $('#add-post-modal').modal('hide');

                //reset the form
                $(this)[0].reset();
                $('#user').focus();
            });
        }
    };	

    postsController.setupView();

});