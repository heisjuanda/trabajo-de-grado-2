extends Control

@export var message: String
@export var delay_between_letters: float = 0.05  # Tiempo entre cada letra
@export var max_chars_per_line: int = 20  # Máximo de caracteres por línea
@onready var label = $Label
@onready var label_2 = $Label2

func _ready():
	label.text = ""
	label_2.text = "E ->"
	show_message(message)

# Función para mostrar el mensaje letra por letra
func show_message(text_to_display: String):
	label.text = ""  # Asegurarse de que el texto esté vacío al comenzar
	var displayed_text = ""
	var current_line = ""
	var char_count = 0
	var words = text_to_display.split(" ")
	
	for word in words:
		# Si la línea actual con la nueva palabra excede el límite de caracteres
		if char_count + word.length() + (1 if current_line.length() > 0 else 0) > max_chars_per_line:
			# Añadir la línea actual al texto mostrado y hacer un salto de línea
			displayed_text += current_line + "\n"
			current_line = ""
			char_count = 0
		
		# Añadir un espacio si no es el comienzo de la línea
		if current_line.length() > 0:
			current_line += " "
			char_count += 1

		# Añadir la palabra actual a la línea
		for letter in word:
			current_line += letter
			char_count += 1
			# Mostrar el texto en el label
			label.text = displayed_text + current_line
			await get_tree().create_timer(delay_between_letters).timeout
		
		# Añadir un espacio al final de la palabra si no es la última
		if word != words[-1]:
			current_line += " "
			char_count += 1
			label.text = displayed_text + current_line
			await get_tree().create_timer(delay_between_letters).timeout

	# Añadir el texto restante y mostrar el resultado final
	if current_line != "":
		displayed_text += current_line
		label.text = displayed_text
		await get_tree().create_timer(delay_between_letters).timeout

	print("Waiting for key press...")
	await wait_for_key()

# Función que espera hasta que se presione una acción específica
func wait_for_key(action: String = "ui_attack"):
	while not Input.is_action_just_pressed(action):
		await get_tree().process_frame  # Espera un frame
	label.text = ""
	label_2.text = ""
