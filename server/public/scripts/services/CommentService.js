app.service('CommentService', function ($http) {
    console.log('CommentService loaded');
    let self = this;
    self.comments = {
        data: ''
    };

    //POST COMMENT TO A BILL
    self.postComment = function(value, billId, congress) {
        self.commentToAdd = value;
        $http.post('/comment', self.commentToAdd).then(function(response){
            console.log('Comment added', response);
            self.retrieveComments(billId, congress);
        }).catch(function(err){
            console.log('Error posting comments:', err)
        });
    }

    //RETRIEVE COMMENTS FOR BILL
    self.retrieveComments = function(billId, congress) {
        let route = '/comment/' + billId + '/' + congress;
        $http.get(route).then(function(response){
            self.comments.data = response.data;
            console.log('Comments:', self.comments.data);
        }).catch(function(err){
            console.log('Error retrieving comments:', err);
        })
    }

    //RETRIEVE COMMENTS FOR MEMBER
    // self.retrieveMemberComments = function() {
    //     let route = `/comment/member/${self.memberId}/${self.memberCongress}`;
    //     console.log('THIS IS THE CONGRESS', self.memberCongress);
    //     $http.get(route).then(function(response){
    //         console.log('Retrieved comments:', response);
    //         self.comments = response.data;
    //         console.log('Comments:', self.comments);
    //     }).catch(function(err){
    //         console.log('Error retrieving comments:', err);
    //     })
    // }

    //LIKE A COMMENT
    self.likeComment = function(value) {
        let comment = value;
        $http.put('/comment', comment).then(function(response){
            console.log('Liked a comment', response);
            self.retrieveComments();
        }).catch(function(error){
            console.log('Error liking the comment');
        })
    }

    self.deleteComment = function(value) {
        $http.put('/comment/delete', value).then(function(response){
            console.log('Deleted a comment', response);
            self.retrieveComments();
        }).catch(function(error){
            console.log('Error deleting comment');
        })
    }

})