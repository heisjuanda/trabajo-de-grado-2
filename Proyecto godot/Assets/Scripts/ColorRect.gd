extends Control

func _ready():
	var color_rect = ColorRect.new()
	color_rect.color = Color.BLACK

	# Ajustar el anclaje para que ocupe todo el espacio disponible
	color_rect.anchor_left = 0.0
	color_rect.anchor_top = 0.0
	color_rect.anchor_right = 1.0
	color_rect.anchor_bottom = 1.0

	# Asegurarse de que el ColorRect esté alineado correctamente
	color_rect.rect_min_size = Vector2(0, 0)  # Opcional, asegura que se adapte a cualquier tamaño

	add_child(color_rect)
