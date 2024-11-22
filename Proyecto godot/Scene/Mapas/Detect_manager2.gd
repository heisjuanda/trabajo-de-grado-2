extends Node

@onready var blocks = [$Detector, $Detector2]  # Asegúrate de que la ruta sea correcta
@onready var tilemap = $"../TileMap"  # Ruta a tu TileMap

func _ready():
	for block in blocks:
		block.connect("box_detected", Callable(self, "_on_box_detected"))
		block.connect("box_removed", Callable(self, "_on_box_removed"))

func _on_box_detected(block):
	print("Box detected:", block.name)
	check_all_blocks()

func _on_box_removed(block):
	print("Box removed:", block.name)
	check_all_blocks()

func check_all_blocks():
	print("Checking all blocks...")
	for block in blocks:
		print(block.name, "active:", block.active)
		if not block.active:
			return  # Si algún bloque no está activo, no hacemos nada

	# Si todos los bloques están activos, ejecutamos el código para romper los bloques
	print("All blocks active. Removing blocks...")
	remove_blocks()
	
func remove_blocks():
	var blocks_to_remove = [Vector2(1, -5), Vector2(2, -5), Vector2(3, -5), Vector2(4, -5)]
	for position in blocks_to_remove:
		tilemap.set_cell(1, Vector2i(position), -1)  # Elimina el tile en la capa 1

