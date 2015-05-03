global.rekuire = require('rekuire');
var fs = require('fs');
var nconf = require('nconf');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Set default views path for the web pages
app.set('views', path.join(__dirname, 'views'));
// Set the view rendering engine.
app.set('view engine', 'jade');
// Allow files in /public to be served as is (for css, js etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));


nconf.argv()
    .env()
    .file({ file: './config.json' });


//load up env based config file.
nconf.defaults( {
    'game_server_password' :'password',
    'game_server_port' : '8080',
    'game_server_fetch_url' : 'http://localhost:8080/headless/world_state/',
    'twitch_name' : 'test',
    'twitch_auth' : 'test',
    'twitch_channel' : '#test',
    'twitch_command' : '!battle',
    
    'round_length' : 60,
    'between_round_length' : 60,
    
    'lctv_auth_name' : 'test',
    'lctv_auth_pass' : 'b@test',
    'lctv_username' : 'test',
    'lctv_channel' : 'test',
    'lctv_enabled' : 'false',
    'session_token' : 'testtoken'
});

var GameServer = require("./gameServer/server.js");
var battleServer = GameServer.Instance();

//load up routes once globals are created
var godotRoutes = require("./routes/godot.js");
var webRoutes = require("./routes/web.js");
var websiteRoutes = require("./routes/website.js");

app.use(bodyParser.json({}));
app.use("/headless", godotRoutes);
app.use("/web", webRoutes);
app.use(websiteRoutes);

var port = nconf.get("game_server_port");
var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("TwitchBattle server running. Listening on http://%s:%s", host, port);
});




