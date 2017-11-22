var express = require('express');
var router = express.Router();
var axios = require('axios');
var key = process.env.PROPUBLICA_KEY;

//Retrieve a recent bills voted on
router.get('/:id', function(req, res){
    let chamber = req.params.id;
    let info;
    axios.get(`https://api.propublica.org/congress/v1/${chamber}/votes/recent.json`,{
        headers : {
            'X-Api-Key' : key
        }
    }).then(function(response){
        info = response.data;
        console.log(info);
        res.send(info);
    }).catch(function(error){
        console.log('Error', error);
        res.sendStatus(500);
    })
})


module.exports = router;