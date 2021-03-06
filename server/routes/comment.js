var express = require('express');
var router = express.Router();
var axios = require('axios');
var key = process.env.PROPUBLICA_KEY;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({ user: String, username: String, userProfileImage: String, member: String, billId: String, congress: Number, comment: String, date: Date, position: String, likes: Number, url: String });
var Comment = mongoose.model('Comment', CommentSchema, 'comments');

//USED TO POST COMMENT
router.post('/', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.id === req.body.user) {
            var commentToAdd = new Comment(req.body);
            commentToAdd.save(function (err, data) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            })
        }
    }
})

//USED TO LIKE A COMMENT
router.put('/', function (req, res) {
    let comment = req.body;
    if (req.isAuthenticated()) {
        Comment.findByIdAndUpdate({ "_id": comment._id }, { $inc: { likes: 1 } }, function (err, data) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        })
    }
})

//USED TO DELETE A COMMENT
router.put('/delete', function (req, res) {
    let comment = req.body;
    if (req.isAuthenticated()) {
        if (req.user.id === comment.user) {
            Comment.findByIdAndRemove({ "_id": comment._id }, function (err, data) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
        }
    }
})

//USED TO RETRIEVE A COMMENTS FOR A BILL
router.get('/bill/:bill/:congress', function (req, res) {
    let bill = req.params.bill;
    let congress = req.params.congress;
    let offset = parseInt(req.query.offset);
    let total = '';
    let support = '';
    let oppose = '';
    Comment.find({ "billId": bill, "congress": congress }).count(function (err, count) {
        total = count;
    })
    .then(Comment.find({ "billId": bill, "congress": congress, "position": "support" }).count(function (err, count) {
        support = count;
    }))
    .then(Comment.find({ "billId": bill, "congress": congress, "position": "oppose" }).count(function (err, count) {
        oppose = count;
    }))
    .then(Comment.find({ "billId": bill, "congress": congress }, null, { skip: offset, limit: 10, sort: { "date": -1 } }, function (err, foundComments) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            let data = {
                comments: foundComments,
                results: total,
                supporters: support,
                opposers: oppose
            }
            res.send(data);
        }
    })
        )
})

//USED TO RETRIEVE A COMMENTS FOR A MEMBER
router.get('/member/:member', function (req, res) {
    let member = req.params.member;
    let offset = parseInt(req.query.offset);
    let total = '';
    Comment.find({ "member": member }).count(function (err, count) {
        total = count;
    }).then(Comment.find({ "member": member }, null, { skip: offset, limit: 10, sort: { "date": -1 } }, function (err, foundComments) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            let data = {
                comments: foundComments,
                results: total
            }
            res.send(data);
        }
    })
        )
})

//USED TO RETRIEVE COMMENTS POSTED BY A SPECIFIC USER
router.get('/user/:id', function (req, res) {
    let user = req.params.id;
    let offset = parseInt(req.query.offset);
    let total = '';
    Comment.find({ "user": user }).count(function (err, count) {
        total = count;
    }).then(Comment.find({ "user": user }, null, { skip: offset, limit: 10, sort: { "date": -1 } }, function (err, foundComments) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            let data = {
                comments: foundComments,
                results: total
            }
            res.send(data);
        }
    })
        )
})

module.exports = router;