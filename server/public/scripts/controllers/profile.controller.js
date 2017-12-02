app.controller('ProfileController', function (UserService, UploadService, CommentService, $http) {
    console.log('ProfileController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.editing = false;
    self.stateHouse = '';
    self.stateSenate = '';
    self.comments = CommentService.comments;
    self.offset = 0;

    //UPDATE PROFILE FROM EDITING
    self.updateProfile = function () {
        $http.put('/user/' + self.userObject.id, self.userObject).then(function (response) {
            console.log('User update success');
            self.editing = !self.editing;
        }).catch(function (err) {
            console.log('Error making updates', err);
        })
    }
    
    //CHANGE USER PROFILE PICTURE
    self.uploadImageToAmazon = function(){
        let image = document.getElementById('imageUpload').files[0];
        let data = {
            user: self.userObject.id,
            username: self.userObject.userName
        }
        UploadService.uploadImageToAmazon(image, data);
    }

    //LOGOUT
    self.logout = function(){
        UserService.logout();
      }

    //RETRIEVE HOUSE MEMBERS FOR USER
    $http.get('/member/house/' + self.userObject.location).then(function (response) {
        self.stateHouse = response.data;
        console.log(self.stateHouse);
    }).catch(function (error) {
        console.log('Error', error);
    })

    //RETRIEVE SENATE MEMERS FOR USER
    $http.get('/member/senate/' + self.userObject.location).then(function (response) {
        self.stateSenate = response.data;
        console.log(self.stateSenate);
    }).catch(function (error) {
        console.log('Error', error);
    })

    //RETRIEVE COMMENTS FROM USER
    self.retrieveUserComments = function() {
        CommentService.retrieveUserComments(self.offset);
        console.log('HERE ARE THE COMMENTS:', self.comments);
    }
    self.retrieveUserComments();

    //DELETE A COMMENT
    self.deleteComment = function (value) {
    CommentService.deleteComment(value);
    }


    //Identify bottom of page scroll -- retrieve additional comments at bottom
    function getScrollXY() {
        var scrOfX = 0, scrOfY = 0;
        if( typeof( window.pageYOffset ) == 'number' ) {
            //Netscape compliant
            scrOfY = window.pageYOffset;
            scrOfX = window.pageXOffset;
        } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
            //DOM compliant
            scrOfY = document.body.scrollTop;
            scrOfX = document.body.scrollLeft;
        } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
            //IE6 standards compliant mode
            scrOfY = document.documentElement.scrollTop;
            scrOfX = document.documentElement.scrollLeft;
        }
        return [ scrOfX, scrOfY ];
    }
    
    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }
    
    document.addEventListener("scroll", function (event) {
        if (getDocHeight() == getScrollXY()[1] + window.innerHeight) {
                if(self.offset < self.comments.limit){
                    self.offset += 10;
                    CommentService.appendUserComments(self.offset);
                    console.log('CONTROLLER, offset:', self.offset, 'limit:', self.comments.limit);
                }
        }
    });
})