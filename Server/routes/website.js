var GameServer = require("../gameServer/server.js");
var battleServer = GameServer.Instance();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var nconf = require('nconf');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var express = require('express');
var router = express.Router();

var session = require('express-session')
var SequelizeStore = require('connect-session-sequelize')(session.Store);

// TODO: Move this so session is only generated when required.
router.use(session({ 
    secret: nconf.get('session_token'), 
    saveUninitialized: false, 
    resave: false
    // ,cookie: { 
    //     secure: true // For some reason this is preventing cookies being set for me.
    // } 
    ,store: new SequelizeStore({ 
        db: battleServer.Database.databaseDriver 
    }) 
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use('login-local', new localStrategy({ passReqToCallback: true, saveUninitialized: false, resave: false }, function(req, username, password, done) {
    var service = req.body.service;
    
    battleServer.Login(service, username, password, function(result) { 
        if (result.status === "FAILED") {
            // Login failed.
            done('Login failed. Please try again.', null);
            return;
        }
        done(null, result.user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    battleServer.GetUser(user.service, user.username, function(result) {
        if (result !== null) {
            done(null, result);
        } else {
            done(null, null);
        }
    });
});

router.get("/", function(req, res) {
    res.render('index', { title: 'Home', user: req.session.passport.user });
});

router.get("/login", function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/my-account');
        return;
    }    
    res.render('login', { title: 'Login' });
});

router.get("/logout", function(req, res) {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.redirect('/login');
});

router.get("/register", function(req, res) {
    res.render('register', { title: 'Home', user: req.session.passport.user });
});

router.get("/download", function(req, res) {
    res.render('download', { title: 'Download', user: req.session.passport.user });
});

router.get("/faq", function(req, res) {
    res.render('faq', { title: 'Faq', user: req.session.passport.user });
});

router.get("/my-account", function(req, res) {
    if (req.isAuthenticated()) {
        res.render('account', { title: 'Account', user: req.session.passport.user });
        return;
    }
    res.redirect('/login');
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
    if (service !== "twitch" && service !== "lctv")
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
    if (user === "" || pass === "" || passconfirm === "")
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
        if (result !== null) {
            created = true;
            authcode = result.authcode;
            res.render('success', {verification: authcode}); 
            return;
        }

        // Failed.
        res.render('registrationfailure'); 
              
    });    
});

router.post("/login", urlencodedParser, function(req, res, next) {
    passport.authenticate('login-local', function(err, user, info) {    
        // If error or no user found.
        if (err || !user) {
            return res.render('login', { title: 'Login', error: err });
        }
        // Otherwise 'login' i.e. create session and cookie
        req.login(user, function(error) {           
            // If there is an error just go back to the login screen.
            // TODO: put a notice message here.
            if (error) {
                return res.render('login');
            }
            // Success, go to the my account page.
            return res.redirect('/my-account');
        });

    })(req, res, next);
});

module.exports = router;
