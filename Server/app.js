var express = require('express');
var GameServer = require("./gameServer/server.js");
var app = express();
var battleServer = GameServer.Instance();


//load up routes once globals are created
var godotRoutes = require("./routes/godot.js");
app.use("/headless", godotRoutes);

var server = app.listen(8080, function() {
   
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("twitchBattle server listen at http://%s:%s", host, port);
});




