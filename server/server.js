var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var aws = require('aws-sdk');
var port = process.env.PORT || 5002;

//Passport requires
var passport = require('./strategies/userStrategy');
var session = require('express-session');

//Route includes
var video = require('./routes/video.js');
var theme = require('./routes/theme.js');
var topic = require('./routes/topic.js');
var register = require('./routes/register.js')
var user = require('./routes/user.js');
var index = require('./routes/index');

//Body parser middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//Load index.html
app.use(express.static('server/public'));

// Passport Session Configuration //
app.use(session({
    secret: 'secret',
    key: 'user', // this is the name of the req.variable. 'user' is convention, but not required
    resave: 'true',
    saveUninitialized: false,
    cookie: { maxage: 60000, secure: false }
 }));
 
 // start up passport sessions
 app.use(passport.initialize());
 app.use(passport.session());

//AWS Setup
aws.config.region = 'us-east-2';
var S3_BUCKET = process.env.S3_BUCKET;
app.get('/sign-s3', (req, res) => {
    var s3 = new aws.S3();
    var fileName = req.query['file-name'];
    var fileType = req.query['file-type'];
    var s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            return res.end();
        }
        var returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        console.log(returnData);
        res.write(JSON.stringify(returnData));
        res.end();
    });
});
//Part of S3 upload that has been unused
// app.post('/save-details', (req, res) => {
//     //TODO: Read Posted form data and do something
// });

//Routes
app.use('/video', video);
app.use('/theme', theme);
app.use('/topic', topic);
app.use('/register', register);
app.use('/user', user);
app.use('/', index);

//Mongo Connection
var mongoURI = '';

if(process.env.MONGODB_URI != undefined){
    mongoURI = process.env.MONGODB_URI;
} else {
    mongoURI = 'mongodb://localhost:27017/solo'
}

var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
    if(err) {
        console.log('MONGO ERROR:', err);
    }
    res.sendStatus(500);
});

mongoDB.once('open', function(){
    console.log('Connected to Mongo');
});

//Start server
app.listen(port, function(){
    console.log('Listening on port:', port)
});