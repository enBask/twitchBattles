
extends Node2D

var webClient = preload("res://scripts/httpClient.gd")

var labelNode
var timerNode
var mapNode
var web = null
var update_url
var player_sprites = []

func _ready():
	# Initialization here
	
	labelNode = get_node("Label")
	timerNode = get_node("Timer")
	mapNode = get_node("TileMap")
	
	web = webClient.new()
	web.get("http://GAMESERVER:8080/headless/get_token/password", self, "on_init_server")

func on_init_server(data):
	var d = {}
	var err = d.parse_json(data)
	if (err == OK):
		update_url = d["fetch_url"];
		timerNode.start()
	




func _on_Timer_timeout():
	timerNode.stop()
	
	if (web !=null):
		web = webClient.new()
	
	web.get(update_url, self, "on_fetch_server")
	
func on_fetch_server(data):
	var d = {}
	var err = d.parse_json(data)
	if (err == OK):
		clear_map()
		var players = d["players"]
		for player in players:
			render_player(player)
	timerNode.start()
	
func clear_map():
	for sprite in player_sprites:
		sprite.queue_free()

	player_sprites.clear()
	
func render_player(player):
	var name = player["username"];
	var location = player["MapLocation"];
	var x = location["x"];
	var y = location["y"];
	var color = player["color"]
	
	var sprite = Sprite.new();
	var tex = ResourceLoader.load("res://images/player2_placeholder.png")
	sprite.set_texture( tex )
	
	sprite.set_pos( Vector2( x * 32 + 16, y * 32 + 16) )
	
	sprite.set_modulate( Color(float(color["r"]), float(color["g"]), float(color["b"])))
	add_child(sprite)
	
	var lbl = Label.new();
	lbl.set_text(name);	
	lbl.add_color_override("font_color", Color(0.2,0.2,0.2,1) )
	lbl.set_pos( Vector2(-20, -8) )
	lbl.set_align(Label.ALIGN_CENTER);
	sprite.add_child(lbl);
	
	player_sprites.push_back(sprite)
	
	
