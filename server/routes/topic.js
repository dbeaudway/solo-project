var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TopicSchema = new Schema({user: String, username: String, title: String, description: String, tags: String, date: Date, url: String});
var Topic = mongoose.model('Topic', TopicSchema, 'topics');

//USED TO POST TOPIC
router.post('/', function(req, res){
    console.log(req.body);
    var topicToAdd = new Topic(req.body);
    topicToAdd.save(function(err, data){
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    })
})

//USED TO RETRIEVE ALL TOPICS
router.get('/', function(req, res){
    Topic.find({}, function(err, foundTopics){
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log(foundTopics);
            res.send(foundTopics);
        }
    })
})

//USED TO RETRIEVE TOPICS BY USER - USER PAGE
router.get('/user/:username', function(req, res){
    let username = req.params.username;
    console.log('THIS IS THE USERS ID', username);
    Topic.find({"username": username}, function(err, foundTopics){
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log(foundTopics);
            res.send(foundTopics);
        }
    })
})

//USED TO RETRIEVE TOPICS BY USER - PROFILE PAGE
// router.get('/user/:id', function(req, res){
//     let userId = req.params.id;
//     console.log('THIS IS THE USERS ID', userId);
//     Topic.find({"user": userId}, function(err, foundTopics){
//         if(err) {
//             console.log(err);
//             res.sendStatus(500);
//         } else {
//             console.log(foundTopics);
//             res.send(foundTopics);
//         }
//     })
// })

//USED TO RETRIEVE A SINGLE TOPIC - TOPICS PAGE
router.get('/item/:id', function(req, res){
    let topicId = req.params.id;
    console.log('THIS IS THE TOPIC ID', topicId);
    Topic.find({"_id": topicId}, function(err, foundTopics){
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log(foundTopics);
            res.send(foundTopics);
        }
    })
})

module.exports = router;