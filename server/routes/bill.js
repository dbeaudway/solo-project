var express = require('express');
var router = express.Router();
var axios = require('axios');
var key = process.env.PROPUBLICA_KEY;

//Retrieve a specific bill
router.get('/:id', function(req, res){
    let id = req.params.id;
    var info;
    axios.get(`https://api.propublica.org/congress/v1/115/bills/${id}`,{
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

//Retrieve related bills to a specific bill
router.get('/related/:id', function(req, res){
    let id = req.params.id;
    var info;
    axios.get(`https://api.propublica.org/congress/v1/115/bills/${id}/related`,{
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
router.get('/cosponsors/:id', function(req, res){
    let id = req.params.id;
    var info;
    axios.get(`https://api.propublica.org/congress/v1/115/bills/${id}/cosponsors`,{
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