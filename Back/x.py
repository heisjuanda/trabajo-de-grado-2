from gradio_client import Client, handle_file

client = Client("gijs/SemThink")
result = client.predict(
		audio_file=handle_file('./record.wav'),
		model_choice="Think + Semantics",
		api_name="/predict"
)
print(result)
