extends Node2D

var http

var running = false
var object
var callback
var thread = null

func _init():
	http = HTTPClient.new()

func create_headers():
	var headers=[
        "User-Agent: twitchBattles/1.0 (Godot)",
        "Accept: */*"
    ]

	return headers

func get(var url, var object, var callback):
	
	if (running):
		return false
	
	running = true	
	self.object = object
	self.callback = callback
	
	if (thread == null):
		thread = Thread.new()

	var err = thread.start(self, "get_thread", parse_url(url) )
	
	return true
	
func parse_url(var url):
	var parts = url.split(":",true)
	var protocol =  parts[0]
	var address = parts[1]
	var port = 80
	var path = "/"
	
	if (protocol == "https"):
		port = 443 #default port based on protocol

	address = address.replace("//","")
		
	#first check the case of address/path	
	var idx = address.find("/")
	if (idx != -1):
		var subparts = address
		address = subparts.substr(0,idx)
		path = subparts.substr(idx, subparts.length())
	else: #means a port was passed in
		if (parts.size() > 2):
			var subparts = parts[2]
			
			var idx = subparts.find("/")
			if (idx == -1): #just a port, no path
				port = subparts
			elif (idx == 0): #just a path, but no port (probably invalid URI)
				path = subparts
			else:	#port + path.
				port = subparts.substr(0, idx)
				path = subparts.substr(idx, subparts.length())
				
	return {
		"protocol":protocol,
		"address":address,
		"port":port,
		"path":path
	}
	
func on_data(var data):
	running =false
	object.call(callback, data)
	

func get_thread(user_data):
	var data = ""
	
	http.close()
	http = HTTPClient.new()
	
	var err = http.connect(user_data["address"], user_data["port"], user_data["protocol"] == "https")
	if (err != OK):
		call_deferred("on_data", data)
		
	while(http.get_status() == HTTPClient.STATUS_CONNECTING or
		  http.get_status() == HTTPClient.STATUS_RESOLVING):
		err = http.poll()
		if (err != OK):
			call_deferred("on_data", data)
		OS.delay_msec(10)	

	if (http.get_status() != HTTPClient.STATUS_CONNECTED):
		call_deferred("on_data", data)
		
	err = http.request(HTTPClient.METHOD_GET,user_data["path"],create_headers() )


	if (err != OK):
		call_deferred("on_data", data)
	
	while (http.get_status() == HTTPClient.STATUS_REQUESTING):
        http.poll()
        OS.delay_msec(10)

	if (http.get_status() != HTTPClient.STATUS_BODY &&
		http.get_status() != HTTPClient.STATUS_CONNECTED
		):
		call_deferred("on_data", data)
		
	if (!http.has_response()):
		call_deferred("on_data", data)
	
	var rb = RawArray()
	while(http.get_status() == HTTPClient.STATUS_BODY):		
		http.poll()
		if (err != OK):
			call_deferred("on_data", data)
		var chunk = http.read_response_body_chunk()
		if (chunk.size() == 0):
			OS.delay_msec(10)
		else:
			rb = rb + chunk
	

	data = rb.get_string_from_ascii()	
	call_deferred("on_data", data)
	
	