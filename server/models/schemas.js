var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TopicSchema = new Schema({
    user: String, 
    username: String, 
    title: String, 
    description: String, 
    tags: String, 
    date: Date, 
    url: String
});

var CommentSchema = new Schema({
    user: String, 
    username: String, 
    userProfileImage: String, 
    topic: String, 
    topicTitle: String, 
    comment: String, 
    tags: String, 
    date: Date, 
    url: String
});

module.exports = {
    topic: mongoose.model('Topic', TopicSchema, 'topics'),
    comment: mongoose.model('Comment', CommentSchema, 'comments')
}