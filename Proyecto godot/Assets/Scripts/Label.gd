extends Control

@onready var label = $"."

func _ready():
	label.text = ""  # Limpiamos el texto inicialmente
	show_message("¡Hola Mundo!")  # Llamamos a la función para mostrar el mensaje

func show_message(message: String):
	label.text = ""  # Limpiar el texto anterior
	var index = 0

	while index < message.length():
		label.text += message[index]  # Añade la siguiente letra al Label
		await get_tree().create_timer(0.1).timeout  # Espera un breve momento
		index += 1

	await until_e_pressed()

func until_e_pressed():
	await Input.is_action_just_pressed("ui_attack")  # Espera hasta que se presione "E"
