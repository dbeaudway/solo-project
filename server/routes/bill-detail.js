var express = require('express');
var router = express.Router();
var axios = require('axios');
var key = process.env.PROPUBLICA_KEY;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BillCommentSchema = new Schema({ user: String, username: String, userProfileImage: String, billId: String, congress: Number, comment: String, date: Date, position: String, likes: Number, url: String, video: Boolean });
var BillComment = mongoose.model('BillComment', BillCommentSchema, 'billcomments');

//Retrieve a specific bill
router.get('/:id/:congress', function (req, res) {
    let id = req.params.id;
    let congress = req.params.congress;
    let info;
    axios.get(`https://api.propublica.org/congress/v1/${congress}/bills/${id}`, {
        headers: {
            'X-Api-Key': key
        }
    }).then(function (response) {
        console.log('THIS IS THE bill RESPONSE', response);
        info = response.data;
        res.send(info);
    }).catch(function (error) {
        console.log('Error', error);
        res.sendStatus(500);
    })
})

//Retrieve cosponsors to a specific bill
router.get('/cosponsors/:id/:congress', function (req, res) {
    let id = req.params.id;
    let congress = req.params.congress;
    var info;
    axios.get(`https://api.propublica.org/congress/v1/${congress}/bills/${id}/cosponsors`, {
        headers: {
            'X-Api-Key': key
        }
    }).then(function (response) {
        info = response.data;
        res.send(info);
    }).catch(function (error) {
        console.log('Error', error);
        res.sendStatus(500);
    })
})

//USED TO POST COMMENT
router.post('/', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.id === req.body.user) {
            console.log(req.body);
            var commentToAdd = new BillComment(req.body);
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
router.put('/comments', function (req, res) {
    let comment = req.body;
    if (req.isAuthenticated()) {
        BillComment.findByIdAndUpdate({ "_id": comment._id }, { $inc: { likes: 1 } }, function (err, data) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        })
    }
})

//USED TO DELETE A COMMENT
router.put('/comments/delete', function (req, res) {
    let comment = req.body;
    if (req.isAuthenticated()) {
        if (req.user.id === comment.user) {
            BillComment.findByIdAndRemove({ "_id": comment._id }, function (err, data) {
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
router.get('/comments/:bill/:congress', function (req, res) {
    let bill = req.params.bill;
    let congress = req.params.congress;
    BillComment.find({ "billId": bill, "congress": congress }, function (err, foundComments) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log(foundComments);
            res.send(foundComments);
        }
    })
})

module.exports = router;