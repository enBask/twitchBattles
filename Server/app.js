var fs = require('fs');
var nconf = require('nconf');
var path = require('path');
var express = require('express');
var app = express();

// Set default views path for the web pages
app.set('views', path.join(__dirname, 'views'));
// Set the view rendering engine.
app.set('view engine', 'jade');
// Allow files in /public to be served as is (for css, js etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

//load up env based config file.
nconf.set('game_server_password', 'password');
nconf.set('game_server_port', '8080');
nconf.set('game_server_fetch_url', 'http://GAMESERVER:8080/headless/world_state/');
nconf.set('twitch_name', 'test');
nconf.set('twitch_auth', 'test');
nconf.set('twitch_channel', '#test');
nconf.set('twitch_command', '!battle');   

nconf.argv()
     .env()
     .file({file: './config.json'});

var GameServer = require("./gameServer/server.js");
var battleServer = GameServer.Instance();

//load up routes once globals are created
var godotRoutes = require("./routes/godot.js");
var webRoutes = require("./routes/web.js");
app.use("/headless", godotRoutes);
app.use(webRoutes);

var server = app.listen(nconf.get("game_server_port"), function() {
   
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("TwitchBattle server running. Listening on http://%s:%s", host, port);
});




