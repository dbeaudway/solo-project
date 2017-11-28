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

var BillCommentSchema = new Schema({ 
    user: String, 
    username: String, 
    userProfileImage: String,
    member: String, 
    billId: String, 
    congress: Number, 
    comment: String, 
    date: Date, 
    position: String, 
    likes: Number, 
    url: String, 
    video: Boolean 
});


module.exports = {
    topic: mongoose.model('Topic', TopicSchema, 'topics'),
    comment: mongoose.model('Comment', CommentSchema, 'comments')
}