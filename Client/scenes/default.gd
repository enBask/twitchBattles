
extends Node2D

var webClient = preload("res://scripts/httpClient.gd")

var timer_label_node
var player_label_node
var log_label_node
var timerNode
var mapNode
var web = null
var update_url
var player_sprites = []
var current_round_state = false
var round_time = 0
func _ready():
	# Initialization here
	
	timer_label_node = get_node("timer_label")
	player_label_node = get_node("player_label")
	log_label_node = get_node("log_label");
	timerNode = get_node("Timer")
	mapNode = get_node("TileMap")
	
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
	
		if (d["game_active"] == false):
			timer_label_node.hide()
			return
			
		var log_data = ""
		for entry in d["round_log"]:
			log_data = log_data + entry +"\r\n"
			
		log_label_node.set_text(log_data)
		
		clear_map()
		player_label_node.set_text("")
		var players = d["players"]
		for player in players:
			render_player(player)
			
		var round_active = d["round_active"]
		var checkin_active = d["checkin_active"]
		var round_length = d["round_length"]
		var between_round_length = d["between_round_length"]
		
		var length = round_length
		if (!round_active):
			length = between_round_length
			
		round_time = length - round( float(d["round_timer"]))
		
		timer_label_node.show()
		if (checkin_active):
			timer_label_node.set_text("Game created.   !battle join to play");
		elif (round_active):
			timer_label_node.set_text("Round active for " + str(round_time) +"s, input commands now")
		else:
			timer_label_node.set_text("Round inactive for " + str(round_time) +"s, please wait.")
		
	timerNode.start()

func clear_map():
	for sprite in player_sprites:
		sprite.queue_free()

	player_sprites.clear()
	
func render_player(player):
	print(player)
	var name = player["username"]
	var number = player["number"]
		
	var x = player["x"]
	var y = player["y"]
	var location = player["location"]
	var color = player["color"]
	
	var sprite = Sprite.new()
	var tex = ResourceLoader.load("res://images/player2_placeholder.png")
	sprite.set_texture( tex )
	
	var map_pos = mapNode.get_pos()
	sprite.set_pos( map_pos + Vector2( x * 32 + 16, y * 32 + 16) )
	
	sprite.set_modulate( Color(float(color["r"]), float(color["g"]), float(color["b"])))
	add_child(sprite)
	
	var lbl = Label.new()
	lbl.set_text(str(number));
	lbl.add_color_override("font_color", Color(1.0,0,0,1) )
	lbl.set_pos( Vector2(-7,-7) )
	lbl.set_align(Label.ALIGN_CENTER);
	sprite.add_child(lbl);
	
	player_sprites.push_back(sprite)
	
	#update player info panel.
	var txt = player_label_node.get_text()
	
	txt = txt + "["+ str(number) +"]" + name + " ["+ location +"]" + " HP: " + str(player["hitpoints"]) +"\r\n"
	player_label_node.set_text(txt)
	

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

