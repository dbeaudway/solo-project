var express = require('express');
var router = express.Router();
var axios = require('axios');
var key = process.env.PROPUBLICA_KEY;

//Retrieve a specific bill
router.get('/:id/:congress', function(req, res){
    let id = req.params.id;
    let congress = req.params.congress;
    let info;
    axios.get(`https://api.propublica.org/congress/v1/${congress}/bills/${id}`,{
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

//Retrieve cosponsors to a specific bill
router.get('/cosponsors/:id/:congress', function(req, res){
    let id = req.params.id;
    let congress = req.params.congress;
    var info;
    axios.get(`https://api.propublica.org/congress/v1/${congress}/bills/${id}/cosponsors`,{
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