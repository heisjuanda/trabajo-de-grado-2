extends Area2D

@export var cordenada_x : int = 0
@export var cordenada_y : int = 0
@export var box : bool = false

func _ready():
	pass

func _process(delta):
	pass

func _on_body_entered(body):
	if box and body is CharacterBody2D and body.name != "Player":
		body.position.x = cordenada_x
		body.position.y = cordenada_y
	elif not box and body.name == "Player":
		body.position.x = cordenada_x
		body.position.y = cordenada_y
