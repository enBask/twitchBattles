
extends Node2D

var webClient = preload("res://scripts/httpClient.gd")

var labelNode
var timerNode
var lblTimer
var mapNode
var web = null
var update_url
var player_sprites = []
var current_round_state = false
func _ready():
	# Initialization here
	
	labelNode = get_node("Label")
	timerNode = get_node("Timer")
	mapNode = get_node("TileMap")
	lblTimer = get_node("lblTimer")
	
	build_grid_labels()
	
	web = webClient.new()
	web.get("http://www.twitchbattles.com/headless/get_token/password", self, "on_init_server")

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
	
	var round_active = d["round_active"];
	
	if (round_active != current_round_state):
		labelNode.show()
		if (round_active):
			labelNode.set_text("Round active for 60s, input commands now")
			lblTimer.start()
		else:
			labelNode.set_text("Between rounds...you can now !battle checkin to play")
			lblTimer.start()
			
	current_round_state = round_active

func clear_map():
	for sprite in player_sprites:
		sprite.queue_free()

	player_sprites.clear()
	
func render_player(player):
	var name = player["username"];
	
	if (!player.has("MapLocation")):
		return
	
	var location = player["MapLocation"];
	var x = location["x"];
	var y = location["y"];
	var color = player["color"]
	
	var sprite = Sprite.new();
	var tex = ResourceLoader.load("res://images/player2_placeholder.png")
	sprite.set_texture( tex )
	
	var map_pos = mapNode.get_pos();
	sprite.set_pos( map_pos + Vector2( x * 32 + 16, y * 32 + 16) )
	
	sprite.set_modulate( Color(float(color["r"]), float(color["g"]), float(color["b"])))
	add_child(sprite)
	
	var lbl = Label.new();
	lbl.set_text(name);	
	lbl.add_color_override("font_color", Color(0.2,0.2,0.2,1) )
	lbl.set_pos( Vector2(-20, -8) )
	lbl.set_align(Label.ALIGN_CENTER);
	sprite.add_child(lbl);
	
	player_sprites.push_back(sprite)

func build_grid_labels():
	var map_pos = mapNode.get_pos()
	var cell_size =mapNode.get_cell_size()
	var width = 30 * cell_size.x
	var height = 22 * cell_size.y
	
	for i in range(0,30):
		var lbl = Label.new()
		var lbl2 = Label.new()
		lbl.set_text(str(i+1))
		lbl.set_pos( Vector2( map_pos.x + (i * 32) + 8, map_pos.y-16 ) )
		add_child(lbl)
		
		lbl2.set_text(str(i+1))
		lbl2.set_pos( Vector2( map_pos.x + (i * 32) + 8, map_pos.y+height ) )
		add_child(lbl2)
	
	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	var len = alphabet.length()
	for i in range(0,22):
		var lbl = Label.new()
		var lbl2 = Label.new()
		
		var data = ""
		if (i >= len):
			data = alphabet[i / len - 1] + alphabet[i % len]
		else:
			data = alphabet[i];
		
		lbl.set_text(data)
		lbl.set_pos( Vector2( map_pos.x-16, map_pos.y + (i * 32) + 8) )
		add_child(lbl)
		
		lbl2.set_text(data)
		lbl2.set_pos( Vector2( map_pos.x+width+8, map_pos.y + (i * 32) + 8) )
		add_child(lbl2)
	


func _on_lblTimer_timeout():
	labelNode.hide()
	lblTimer.stop()
	pass # replace with function body
