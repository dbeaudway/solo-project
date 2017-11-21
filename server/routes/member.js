var express = require('express');
var router = express.Router();
var axios = require('axios');
var key = process.env.PROPUBLICA_KEY;

router.get('/:id', function(req, res){
    let id = req.params.id;
    var info;
    axios.get(`https://api.propublica.org/congress/v1/members/${id}`,{
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