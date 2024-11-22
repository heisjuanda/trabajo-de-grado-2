extends Area2D

@export var direction_value: int = 0  # Valor numérico del 1 al 5
@onready var sprite_2d = $Sprite2D
@onready var audio = $AudioStreamPlayer2D

signal player_impulsed(direction: Vector2)

func _ready():
	connect("body_entered", Callable(self, "_on_body_entered"))
	texture()

func _on_body_entered(body):
	if body is CharacterBody2D:
		impulse_player(body)

func impulse_player(player):
	var impulse_direction = Vector2.ZERO

	match direction_value:
		1:
			impulse_direction = Vector2(1, 0.5)  # Derecha 
			audio.play()
		2:
			impulse_direction = Vector2(-1, 0.5)  # abajo
			audio.play()
		3:
			impulse_direction = Vector2(1, -0.5)  # Arriba
			audio.play()
		4:
			impulse_direction = Vector2(-1, -0.5)  # izquierda
			audio.play()
		5:
			impulse_direction = Vector2.ZERO  # Detener
	# Emitir una señal para que el jugador maneje el impulso
	emit_signal("player_impulsed", impulse_direction)
	player.global_position = position + Vector2(-5,-5)
	
	
func texture():
	match direction_value:
		1:
			sprite_2d.frame = 2 # Derecha 
		2:
			sprite_2d.frame = 4  # abajo
		3:
			sprite_2d.frame = 1  # Arriba
		4:
			sprite_2d.frame = 5  # izquierda
		5:
			sprite_2d.texture = null # Detener
			
	# Emitir una señal para que el jugador maneje el impulso

