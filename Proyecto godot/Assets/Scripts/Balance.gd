extends Area2D
@onready var audio = $AudioStreamPlayer2D
@onready var animation_player = $AnimationPlayer
@onready var left_area = $left_area
@onready var right_area = $right_area

var left_box = null
var right_box = null

func _ready():
	# Conectar las señales del área principal
	self.body_entered.connect(_on_area_body_entered)
	self.body_exited.connect(_on_area_body_exited)

func _on_area_body_entered(body):
	if body.has_method("get_weight"):
		if body.get_global_position().x < self.get_global_position().x:
			left_box = body
		else:
			right_box = body
		check_balance()

func _on_area_body_exited(body):
	if body == left_box:
		left_box = null
	elif body == right_box:
		right_box = null
	check_balance()

func check_balance():
	if left_box and right_box:
		var left_weight = left_box.get_weight()
		var right_weight = right_box.get_weight()

		if left_weight > right_weight:
			animation_player.play("izquierda")
			audio.play()
		elif left_weight < right_weight:
			animation_player.play("derecha")
			audio.play()
		else:
			animation_player.play("estatic")
	else:
		animation_player.play("estatic")
