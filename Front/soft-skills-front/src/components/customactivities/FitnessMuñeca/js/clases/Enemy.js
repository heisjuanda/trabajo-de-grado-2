/* Esta clase controla el movimiento de los bloques enemigos */

export class Enemy {
    constructor({
        /* Declaramos los valores iniciales tales como posicion inical, velocidad o tamaño */
        colisionBlock = [],
        ctx2 
    }) {
        this.position = {
            x: 850,
            y: 200,
        };
        this.velocity = {
            x: -8,
            y: 0,
        };

        this.heights = [50, 75, 100, 125, 150];
        this.height = this.heights[Math.floor(Math.random() * this.heights.length)];

        this.width = 25;
        this.sides = {
            bottom: this.position.y + this.height,
        };
        this.gravity = 1;
        this.colisionBlock = colisionBlock || []; 
        this.ctx2 = ctx2; 
        
    }
    /*Creamos una gravedad que haga que el bloque pueda ir aletoriamente en los dos ejes verticales */
    randomizeGravity() {
        const randomSign = Math.random() < 0.5 ? -1 : 1;
        this.gravity *= randomSign;
    }
    draw() {
        this.ctx2.fillStyle = "yellow"; 
        this.ctx2.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.checkHorizontalColision();
        this.applyGravity();
        this.checkVerticalColision();
    }
/*Esta funcion verifica si existe un bloque en alguna cordenada x cercana e
 impide el movimiento con el mismo cambiando la cordenada constantemente en un pixel */
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
                    this.position.y = 200;

                    this.height = this.heights[Math.floor(Math.random() * this.heights.length)];
                    this.randomizeGravity();
                    break;
                }
                if (this.velocity.x > 0) {
                    this.position.x = 800;
                    this.height = this.heights[Math.floor(Math.random() * this.heights.length)];
                    
                    break;
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
    }
/*Esta funcion verifica si existe un bloque en alguna cordenada y cercana e impide 
el movimiento con el mismo cambiando la cordenada constantemente en un pixel*/
    checkVerticalColision() {
        if (!Array.isArray(this.colisionBlock)) return; 

        for (let i = 0; i < this.colisionBlock.length; i++) {
            const colisionBlock = this.colisionBlock[i];

            if (this.position.x <= colisionBlock.position.x + colisionBlock.width &&
                this.position.x + this.width >= colisionBlock.position.x &&
                this.position.y + this.height >= colisionBlock.position.y &&
                this.position.y <= colisionBlock.position.y + colisionBlock.height) {

                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    this.position.y = colisionBlock.position.y + colisionBlock.height + 1;
                    break;
                }
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    this.position.y = colisionBlock.position.y - this.height - 1;
                    break;
                }
            }
        }
    }
}
