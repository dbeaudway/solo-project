var express = require('express');
var router = express.Router();
var axios = require('axios');
var key = process.env.PROPUBLICA_KEY;

//Retrieve recent bills voted on
router.get('/votes/:id', function(req, res){
    let chamber = req.params.id;
    let info;
    axios.get(`https://api.propublica.org/congress/v1/${chamber}/votes/recent.json`,{
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

//Retrieve upcoming bills in the House and Senate
router.get('/bills/:id', function(req, res){
    let chamber = req.params.id;
    let info;
    axios.get(`https://api.propublica.org/congress/v1/bills/upcoming/${chamber}.json`,{
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

//Retrieve bills based on search
router.get('/search/:id', function(req, res){
    let query = req.params.id;
    let info;
    axios.get(`https://api.propublica.org/congress/v1/bills/search.json?query=${query}`,{
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