var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../models/user.js');
var path = require('path');

// FOCUS ON THIS!! -> req.isAuthenticated() & req.user
// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = req.user;
    // {
    //   username : req.user.username,
    //   id : req.user._id,
    //   date : req.user.date
    // };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

//PUT Route for user profile changes
router.put('/:id', function(req,res){
  let id = req.params.id;
  let user = req.body;
  if(req.isAuthenticated()){
    if(req.user.id === user.id){
      Users.findByIdAndUpdate({"_id": id}, {$set: {"location": user.location, "about": user.about}}, function(err, response){
        if(err) {
          console.log('Error updating database', err);
          res.sendStatus(500);
        } else {
          console.log('Success updating database', response);
          res.sendStatus(200)
        }
      })
    }
  }
})

//PUT Route for user profile image update
router.put('/image/:id', function(req,res){
  let id = req.params.id;
  let image = req.body.url;
  if(req.isAuthenticated()){
    if(req.user.id === id){
      Users.findByIdAndUpdate({"_id": id}, {$set: {"profileImage": image}}, function(err, response){
        if(err) {
          console.log('Error updating database', err);
          res.sendStatus(500);
        } else {
          console.log('Success updating database', response);
          res.sendStatus(200)
        }
      })
    }
  }
})

//GET ROUTE FOR USERS PAGE
router.get('/:username', function(req, res){
  let username = req.params.username;
  Users.findOne({"username": username}, function(err, response){
    if(err) {
      res.sendStatus(500);
    } else {
      res.send(response);
    }
  })
})

//USED TO RETRIEVE MATCHING TOPICS - SEARCH PAGE
router.get('/search/:id', function(req, res){
  let user = req.params.id;
  let value = new RegExp(user, 'i');
  Users.find({"username": value}, function(err, foundUsers){
      if(err) {
          console.log(err);
          res.sendStatus(500);
      } else {
          console.log(foundUsers);
          res.send(foundUsers);
      }
  })
})


module.exports = router;
