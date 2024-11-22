extends Camera2D

@export var object_to_follow:Node2D
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if object_to_follow:
		position = object_to_follow.position
