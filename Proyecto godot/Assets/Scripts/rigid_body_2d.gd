extends RigidBody2D

const SPEED = 100
var direction = Vector2(0,0)
func _physics_process(delta):
	if direction:
		self.velocity = direction * SPEED * delta
	else:
		self.velocity = Vector2.ZERO
		
	


