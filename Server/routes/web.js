var GameServer = require("../gameServer/server.js");
var battleServer = GameServer.Instance();

var express = require('express');
var router = express.Router();

router.get("/create_user/:service/:username/:password", function(req, res) {
    
    
    var service = req.params.service;
    var user = req.params.username;
    var pass = req.params.password;
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    battleServer.CreateUser(service,user,pass,ip, function(result){
        
        res.setHeader('Content-Type:', 'application/json');

        var token = {
          created: true,
          authcode: result.authcode      
        };

        res.end( JSON.stringify( token ) );        
    });
    
});

router.get("/register/:username", function(req, res) {

    var username = req.params.username;

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    res.setHeader('Content-Type:', 'application/json');

    var token = {
        registered: true,
        username: username
    };

    res.end(JSON.stringify(token));
});

module.exports = router;
