
extends Node2D

var webClient = preload("res://scripts/httpClient.gd")

# member variables here, example:
# var a=2
# var b="textvar"

func _ready():
	# Initialization here
	var web = webClient.new()
		
	web.get("http://www.enbask.com", self, "_on_get")

func _on_get(data):
	print(data)
	


