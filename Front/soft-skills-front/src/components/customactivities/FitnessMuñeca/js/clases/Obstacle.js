export class Obstacle {
    constructor({
        colisionBlock = [],
        ctx2 // cambio
    }) {
        this.position = {
            x: 850,
            y: 200,
        };
        this.velocity = {
            x: -5,
            y: 0,
        };

        // Alturas posibles
        this.height = 175

        this.width = 25;
        this.sides = {
            bottom: this.position.y + this.height,
        };
        this.colisionBlock = colisionBlock || []; // Asegurar que sea un arreglo
        this.ctx2 = ctx2; // cambio
        
    }

    draw() {
        this.ctx2.fillStyle = "green"; // cambio
        this.ctx2.fillRect(this.position.x, this.position.y, this.width, this.height); // cambio
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.checkHorizontalColision();
    }

    checkHorizontalColision() {
        if (!Array.isArray(this.colisionBlock)) return; // Verificación adicional

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
