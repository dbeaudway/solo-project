app.service('CommentService', function ($http) {
    console.log('CommentService loaded');
    let self = this;
    self.billId = '';
    self.congress = '';
    self.memberId = '';
    self.comments = {
        data: ''
    };

    //Set page variables
    self.setVariables = function() {
        if(location.hash.indexOf('member') > 0){
            self.billId = '';
            self.memberId = location.hash.split('/')[2];
            self.congress = '';
        } else if(location.hash.indexOf('bill-detail') > 0){
            self.billId = location.hash.split('/')[2];
            self.memberId = '';
            self.congress = location.hash.split('/')[3];
        }
    }

    //POST COMMENT TO A BILL
    self.postBillComment = function(value) {
        self.commentToAdd = value;
        self.commentToAdd.billId = self.billId;
        self.commentToAdd.congress = self.congress;
        $http.post('/comment', self.commentToAdd).then(function(response){
            console.log('Comment added', response);
            self.retrieveBillComments();
        }).catch(function(err){
            console.log('Error posting comments:', err)
        });
    }

    //POST COMMENT TO A MEMBER
    self.postMemberComment = function(value) {
        self.commentToAdd = value;
        self.commentToAdd.member = self.memberId;
        self.commentToAdd.congress = self.congress;
        console.log('COMMENT BEING ADDED', self.commentToAdd);
        $http.post('/comment', self.commentToAdd).then(function(response){
            console.log('Comment added', response);
            self.retrieveMemberComments();
        }).catch(function(err){
            console.log('Error posting comments:', err)
        });
    }

    //RETRIEVE COMMENTS FOR BILL
    self.retrieveBillComments = function() {
        self.setVariables();
        let route = '/comment/bill/' + self.billId + '/' + self.congress;
        $http.get(route).then(function(response){
            self.comments.data = response.data;
            console.log('Comments:', self.comments.data);
        }).catch(function(err){
            console.log('Error retrieving bill comments:', err);
        })
    }

    //RETRIEVE COMMENTS FOR MEMBER
    self.retrieveMemberComments = function() {
        self.setVariables();
        let route = '/comment/member/' + self.memberId;
        console.log('THIS IS THE ROUTE', route);
        $http.get(route).then(function(response){
            self.comments.data = response.data;
            console.log('Comments:', self.comments.data);
        }).catch(function(err){
            console.log('Error retrieving member comments:', err);
        })
    }

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

    //DELETE A COMMENT
    self.deleteComment = function(value) {
        $http.put('/comment/delete', value).then(function(response){
            console.log('Deleted a comment', response);
            self.retrieveComments();
        }).catch(function(error){
            console.log('Error deleting comment');
        })
    }

})