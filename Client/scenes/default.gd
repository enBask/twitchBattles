
extends Node2D

var webClient = preload("res://scripts/httpClient.gd")

var labelNode
var timerNode

var web = null
var update_url

func _ready():
	# Initialization here
	
	labelNode = get_node("Label");
	timerNode = get_node("Timer")
	
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
		var status = d["status"]
		if (status == "OK"):
			var users = d["checked_in"]
			var checked_in_users = ""
			for user in users:
				checked_in_users = checked_in_users + user + "\r\n"
			
			labelNode.set_text("Checked in users:\r\n" + checked_in_users);
	
	timerNode.start()
