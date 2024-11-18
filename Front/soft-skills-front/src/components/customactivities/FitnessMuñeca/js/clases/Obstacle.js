/* Esta clase genera un obstaculo que se puede slatar dependiendo de las condiciones establecidas*/

export class Obstacle {
    /* Aqui se declaran los valores inciales tales como tamaño, velocidad o posicion inicial */

    constructor({
        colisionBlock = [],
        ctx2 
    }) {
        this.position = {
            x: 850,
            y: 200,
        };
        this.velocity = {
            x: -5,
            y: 0,
        };

  
        this.height = 175

        this.width = 25;
        this.sides = {
            bottom: this.position.y + this.height,
        };
        this.colisionBlock = colisionBlock || []; 
        this.ctx2 = ctx2;
        
    }

    draw() {
        this.ctx2.fillStyle = "green"; 
        this.ctx2.fillRect(this.position.x, this.position.y, this.width, this.height); 
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.checkHorizontalColision();
    }
 /*Esta funcion verifica si existe un bloque en alguna cordenada y cercana e impide 
el movimiento con el mismo cambiando la cordenada constantemente en un pixel*/
    checkHorizontalColision() {
        if (!Array.isArray(this.colisionBlock)) return; 

        for (let i = 0; i < this.colisionBlock.length; i++) {
            const colisionBlock = this.colisionBlock[i];

            if (this.position.x <= colisionBlock.position.x + colisionBlock.width &&
                this.position.x + this.width >= colisionBlock.position.x &&
                this.position.y + this.height >= colisionBlock.position.y &&
                this.position.y <= colisionBlock.position.y + colisionBlock.height) {
                if (this.velocity.x < 0) {
                    this.position.x = 800;
                    break;
                }
                if (this.velocity.x > 0) {
                    this.position.x = 800;                    
                    break;
                }
            }
        }
    }

}
