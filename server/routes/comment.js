var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({user: String, username: String, userProfileImage: String, topic: String, topicTitle: String, comment: String, tags: String, date: Date, url: String});
var Comment = mongoose.model('Comment', CommentSchema, 'comments');

//USED TO POST COMMENT
router.post('/', function(req, res){
    if(req.isAuthenticated()){
        if(req.user.id === req.body.user){
            console.log(req.body);
            var commentToAdd = new Comment(req.body);
            commentToAdd.save(function(err, data){
                if(err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            })
        }
    }
})

//USED TO RETRIEVE COMMENTS BY USER - USER PAGE
router.get('/user/:username', function(req, res){
    let username = req.params.username;
    console.log('THIS IS THE USERS ID', username);
    Comment.find({"username": username}, function(err, foundComments){
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log(foundComments);
            res.send(foundComments);
        }
    })
})

//USED TO RETRIEVE A COMMENTS FOR A TOPIC - TOPICS PAGE
router.get('/:id', function(req, res){
    let topicId = req.params.id;
    console.log('THIS IS THE COMMENT ID', topicId);
    Comment.find({"topic": topicId}, function(err, foundComments){
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log(foundComments);
            res.send(foundComments);
        }
    })
})

module.exports = router;