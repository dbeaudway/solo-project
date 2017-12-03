app.service('CommentService', function ($http, UserService) {
    let self = this;
    self.userObject = UserService.userObject;
    self.billId = '';
    self.congress = '';
    self.memberId = '';
    self.comments = {
        data: [],
        limit: ''
    };

    //SET PAGE VARIABLES THAT DETERMINES WHETHER MEMBER OR BILL COMMENT
    self.setVariables = function () {
        if (location.hash.indexOf('member') > 0) {
            self.billId = '';
            self.memberId = location.hash.split('/')[2];
            self.congress = '';
        } else if (location.hash.indexOf('bill-detail') > 0) {
            self.billId = location.hash.split('/')[2];
            self.memberId = '';
            self.congress = location.hash.split('/')[3];
        }
    }

    //POST COMMENT TO A BILL
    self.postBillComment = function (value) {
        self.commentToAdd = value;
        self.commentToAdd.billId = self.billId;
        self.commentToAdd.congress = self.congress;
        self.commentToAdd.date = new Date();
        return $http.post('/comment', self.commentToAdd).then(function (response) {
            self.retrieveBillComments();
        }).catch(function (err) {
            console.log('Error posting comments:', err)
        });
    }

    //POST COMMENT TO A MEMBER
    self.postMemberComment = function (value) {
        self.commentToAdd = value;
        self.commentToAdd.member = self.memberId;
        self.commentToAdd.congress = self.congress;
        self.commentToAdd.date = new Date();
        return $http.post('/comment', self.commentToAdd).then(function (response) {
            self.retrieveMemberComments();
        }).catch(function (err) {
            console.log('Error posting comments:', err)
        });
    }

    //RETRIEVE COMMENTS FOR BILL
    self.retrieveBillComments = function (value) {
        self.setVariables();
        let route = '/comment/bill/' + self.billId + '/' + self.congress + '?offset=' + value;
        $http.get(route).then(function (response) {
            self.comments.data = response.data.comments;
            self.comments.limit = response.data.results;
            self.comments.supporters = response.data.supporters;
            self.comments.opposers = response.data.opposers;
        }).catch(function (err) {
            console.log('Error retrieving bill comments:', err);
        })
    }

    //APPEND COMMENTS FOR BILL
    self.appendBillComments = function (value) {
        let route = '/comment/bill/' + self.billId + '/' + self.congress + '?offset=' + value;
        $http.get(route).then(function (response) {
            response.data.comments.forEach(function (comment) {
                self.comments.data.push(comment);
            });
            self.comments.limit = response.data.results;
        }).catch(function (err) {
            console.log('Error retrieving bill comments:', err);
        })
    }

    //RETRIEVE COMMENTS FOR MEMBER
    self.retrieveMemberComments = function (value) {
        self.setVariables();
        let route = '/comment/member/' + self.memberId + '?offset=' + value;
        $http.get(route).then(function (response) {
            self.comments.data = response.data.comments;
            self.comments.limit = response.data.results;
        }).catch(function (err) {
            console.log('Error retrieving member comments:', err);
        })
    }

    //APPEND COMMENTS FOR BILL
    self.appendMemberComments = function (value) {
        let route = '/comment/member/' + self.memberId + '?offset=' + value;
        $http.get(route).then(function (response) {
            response.data.comments.forEach(function (comment) {
                self.comments.data.push(comment);
            });
            self.comments.limit = response.data.results;
        }).catch(function (err) {
            console.log('Error retrieving bill comments:', err);
        })
    }

    //RETRIEVE COMMENTS POSTED BY A SPECIFIC USER
    self.retrieveUserComments = function (value) {
        self.setVariables();
        let route = '/comment/user/' + self.userObject.id + '?offset=' + value;
        $http.get(route).then(function (response) {
            self.comments.data = response.data.comments;
            self.comments.limit = response.data.results;
        }).catch(function (err) {
            console.log('Error retrieving user comments:', err);
        })
    }

    //APPEND COMMENTS FOR A SPECIFIC USER
    self.appendUserComments = function (value) {
        let route = '/comment/user/' + self.userObject.id + '?offset=' + value;
        $http.get(route).then(function (response) {
            response.data.comments.forEach(function (comment) {
                self.comments.data.push(comment);
            });
            self.comments.limit = response.data.results;
        }).catch(function (err) {
            console.log('Error retrieving user comments:', err);
        })
    }

    //LIKE A COMMENT
    self.likeComment = function (value) {
        let comment = value;
        $http.put('/comment', comment).then(function (response) {
            if (self.memberId) {
                self.retrieveMemberComments();
            } else {
                self.retrieveBillComments();
            }
        }).catch(function (error) {
            console.log('Error liking the comment');
        })
    }

    //DELETE A COMMENT
    self.deleteComment = function (value) {
        $http.put('/comment/delete', value).then(function (response) {
            if (self.memberId) {
                self.retrieveMemberComments();
            } else if(self.billId) {
                self.retrieveBillComments();
            } else {
                self.retrieveUserComments();
            }
        }).catch(function (error) {
            console.log('Error deleting comment');
        })
    }


})