extends Area2D

@export var escena: String
func _on_body_entered(body):
	if body.name == "Player":
		get_tree().change_scene_to_file("res://Scene/Mapas/"+escena+".tscn")
	pass # Replace with function body.
