extends CharacterBody2D

const SPEED = 600
var direction = Vector2(0, 0)
@export var code: int = 0
@export var weight: int = 1

func _physics_process(delta):
	if direction:
		self.velocity = direction * SPEED * delta
	else:
		self.velocity = Vector2.ZERO
func get_code():
	return code
func get_weight():
	return weight
