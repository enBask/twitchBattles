var GameServer = require("../gameServer/server.js");
var battleServer = GameServer.Instance();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var express = require('express');
var router = express.Router();

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


router.get("/", function(req, res) {
    res.render('index');
});

router.get("/login", function(req, res) {
    res.render('login');
});

router.get("/register", function(req, res) {
    res.render('register');
});

router.get("/download", function(req, res) {
    res.render('download');
});

router.get("/faq", function(req, res) {
    res.render('faq');
});

router.post("/register", urlencodedParser, function(req, res) {
    
    if (!req.body) {
        res.send('/register');
    }
     

    /*
        DO NOT EVER TRUST CLIENT INPUT!

        TODO: Sanitize the input data properlly. 
    */

    var service = req.body.service;
    
    // Check service is valid, if not go back to registration page
    // TODO: Do this properlly.
    if (service !== "twitch" && service !== "livecoding")
        res.render('register'); 

    // Get request fields.
    var user = "";
    var pass = "";
    var passconfirm = "";

    // Trim the fields from the request.
    if (req.body.username !== undefined || req.body.username !== null)
        user = req.body.username.trim();
    if (req.body.password !== undefined || req.body.password !== null)
        pass = req.body.password.trim();
    if (req.body.passwordconfirm !== undefined || req.body.passwordconfirm !== null)
        passconfirm = req.body.passwordconfirm.trim();

    // Check data entered - this is done client side, but better to verify serverside as well.
    // TODO: Do this properlly.
    if (user === "" || pass === "" || passconfirm.trim() === "")
        res.render('register'); 

    // Check passwords match
    // TODO: Do this properlly.
    if (pass !== passconfirm)
        res.render('register'); 

    // All good so far, get the Ip from the user.
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Try and create user.
    battleServer.CreateUser(service, user, pass, ip, function(result) {
        
        var authcode = "";
        var created = false;
        
        // Success
        if (result != null) {
            created = true;
            authcode = result.authcode;
            res.render('success', {verification: authcode}); 
            return;
        }

        // Failed.
        res.render('failure'); 
              
    });    
});

module.exports = router;
