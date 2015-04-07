var GameServer = require("../gameServer/server.js");
var battleServer = GameServer.Instance();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var express = require('express');
var router = express.Router();

router.post("/chat", function(req,res) {
    
    var who = req.body.who;
    var message = req.body.msg;
    var src = req.body.src;
    
    var command = battleServer.TwitchBot.command.toString();
    if (message.indexOf(command) === 0) {
        var args = message.substr(command.length, message.length);
        args = args.trim();
        
        battleServer.ProcessChatCommand(who, args, src);
    }
   
    res.end("");        
});

router.get("/create_user/:service/:username/:password", function(req, res) {
    
    
    var service = req.params.service;
    var user = req.params.username;
    var pass = req.params.password;
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    battleServer.CreateUser(service,user,pass,ip, function(result){
        
        var authcode = "";
        var created = false;
        
        if (result != null)
        {
            created = true;
            authcode = result.authcode;
        }
        
        res.setHeader('Content-Type:', 'application/json');

        var token = {
          created: created,
          authcode: authcode      
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
