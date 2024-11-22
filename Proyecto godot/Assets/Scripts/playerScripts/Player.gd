extends CharacterBody2D

@export var SPEED = 40
@export var attack_cooldown : float = 0.4  # Tiempo durante el cual el jugador no puede moverse después de atacar
@onready var collision_handler = $CollisionHandler
@onready var animated_sprite = $AnimationPlayer

var current_direction = Vector2.ZERO
var can_move = true
var attack_timer = 0.0
var is_being_impulsed = false
var impulse_velocity = Vector2.ZERO

func _ready():
	for area in get_tree().get_nodes_in_group("impulse_areas"):
		area.connect("player_impulsed", Callable(self, "_on_player_impulsed"))

func _physics_process(delta):
	if is_being_impulsed:
		velocity = impulse_velocity
		move_and_slide()
		# Desvanecer el impulso gradualmente
	else:
		if can_move:
			var direccion = Input.get_vector("left_move", "right_move", "up_move", "down_move")
			if direccion:
				if Input.is_action_pressed("shift"):
					self.velocity = direccion * SPEED * 2
				else:
					self.velocity = direccion * SPEED
				play_animation(direccion)
				current_direction = direccion
			else:
				self.velocity = Vector2.ZERO
				animated_sprite.stop()

			# Manejo de colisiones en el subnodo
			collision_handler.handle_collisions()
			
		move_and_slide()

		if Input.is_action_just_pressed("ui_attack"): # Asumimos que "ui_attack" es la acción asignada a la tecla "E"
			play_attack_animation(current_direction)

	# Actualizar el temporizador
	if not can_move:
		attack_timer -= delta
		if attack_timer <= 0:
			can_move = true

func play_animation(direccion):
	if direccion.x > 0:
		if direccion.y < 0:
			animated_sprite.play("Up_right_run")
		elif direccion.y > 0:
			animated_sprite.play("Down_right_run")
		else:
			animated_sprite.play("Right_run")
	elif direccion.x < 0:
		if direccion.y < 0:
			animated_sprite.play("Up_left_run")
		elif direccion.y > 0:
			animated_sprite.play("Down_left_run")
		else:
			animated_sprite.play("Left_run")
	else:
		if direccion.y < 0:
			animated_sprite.play("Up_run")
		elif direccion.y > 0:
			animated_sprite.play("Down_run")

func play_attack_animation(direccion):
	can_move = false
	attack_timer = attack_cooldown  # Reiniciar el temporizador al comienzo de la animación
	self.velocity = Vector2.ZERO  # Detener el movimiento
	if direccion.x > 0:
		animated_sprite.play("Right_slash")
	elif direccion.x < 0:
		animated_sprite.play("Left_slash")
	else:
		if direccion.y < 0:
			animated_sprite.play("Up_slash")
		elif direccion.y > 0:
			animated_sprite.play("Down_slash")

func _on_player_impulsed(impulse_direction: Vector2):
	if impulse_direction != Vector2.ZERO:
		is_being_impulsed = true
		impulse_velocity = impulse_direction * SPEED * 5
		play_animation(impulse_direction)
	else:
		is_being_impulsed = false
		impulse_velocity = Vector2.ZERO
