var GameServer = require("../gameServer/server.js");
var battleServer = GameServer.Instance();

var express = require('express');
var router = express.Router();

router.get("/create_user/:service/:username", function(req, res) {
    
    
    var service = req.params.service;
    var user = req.params.username;
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    var result = battleServer.create_user(service,user, ip);
    
    res.setHeader('Content-Type:', 'application/json');
    
    var token = {
      created: true,
      authcode: result.authcode      
    };
    
    res.end( JSON.stringify( token ) );
    
});


module.exports = router;
