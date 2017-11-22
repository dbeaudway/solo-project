var express = require('express');
var router = express.Router();
var axios = require('axios');
var key = process.env.PROPUBLICA_KEY;

// /congress/v1/{congress}/{chamber}/sessions/{session-number}/votes/{roll-call-number}.json

//Retrieve a specific bills voting roll call
router.get('/:congress/:chamber/:session/:rollcall', function(req, res){
    let congress = req.params.congress;
    let chamber = req.params.chamber;
    let session = req.params.session;
    let rollcall = req.params.rollcall;
    let info;
    axios.get(`https://api.propublica.org/congress/v1/${congress}/${chamber}/sessions/${session}/votes/${rollcall}.json`,{
        headers : {
            'X-Api-Key' : key
        }
    }).then(function(response){
        info = response.data;
        res.send(info);
    }).catch(function(error){
        console.log('Error', error);
        res.sendStatus(500);
    })
})

module.exports = router;