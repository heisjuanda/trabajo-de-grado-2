extends Area2D

signal box_detected(box)
signal box_removed(box)

@export var code: int = 0
var active: bool = false

func _ready():
	connect("body_entered", Callable(self, "_on_body_entered"))
	connect("body_exited", Callable(self, "_on_body_exited"))

func _on_body_entered(body):
	if body is CharacterBody2D and body.has_method("get_code") and body.get_code() == code:
		active = true
		emit_signal("box_detected", self)
		print(active)

func _on_body_exited(body):
	if body is CharacterBody2D and body.has_method("get_code") and body.get_code() == code:
		active = false
		emit_signal("box_removed", self)
