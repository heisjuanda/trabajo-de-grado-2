extends Node2D

@onready var box_detected_x_2 = $BoxDetectedX2
@onready var box_detected_x = $BoxDetectedX
@onready var box_detected_y = $BoxDetectedY
@onready var box_detected_y_2 = $BoxDetectedY2

func handle_collisions():
	if box_detected_x.is_colliding():
		var colider = box_detected_x.get_collider()
		colider.direction = Vector2(1, -0.5)
		colider.move_and_slide()

	if box_detected_x_2.is_colliding():
		var colider = box_detected_x_2.get_collider()
		colider.direction = Vector2(-1, 0.5)
		colider.move_and_slide()

	if box_detected_y.is_colliding():
		var colider = box_detected_y.get_collider()
		colider.direction = Vector2(1, 0.5)
		colider.move_and_slide()

	if box_detected_y_2.is_colliding():
		var colider = box_detected_y_2.get_collider()
		colider.direction = Vector2(-1, -0.5)
		colider.move_and_slide()
