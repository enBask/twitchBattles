var nconf = require('nconf');
var GameServer = require("../gameServer/server.js");
var battleServer = GameServer.Instance();

var express = require('express');
var router = express.Router();

router.get("/get_token/:pass", function(req, res) {
    
    var pass = req.params.pass;
    
    
    var token_str =  battleServer.GetToken(pass);
    var token = {
        token :  token_str,
        fetch_url : nconf.get("game_server_fetch_url") + token_str
    }; 
        
    res.setHeader('Content-Type:', 'application/json');
    res.end( JSON.stringify( token ) );
});

router.get("/world_state/:token", function (req, res) {
   
    var token = req.params.token;
    var isValid = battleServer.ValidateToken(token);
     
    res.setHeader('Content-Type:', 'application/json');
     
    if (!isValid) {
       res.end(JSON.stringify({status:"error"}));
    }
    else {
        var world_state = battleServer.GetWorldState();
        res.end(JSON.stringify(world_state));
    }
});

module.exports = router;
