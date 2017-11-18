var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ThemeSchema = new Schema({title: String, description: String, tags: String, date: Date, url: String, members: []});
var Theme = mongoose.model('Theme', ThemeSchema, 'themes');

module.exports = router;