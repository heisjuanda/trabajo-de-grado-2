export class Player {
    constructor({
        colisionBlock = [],
        ctx2 // cambio
    }) {
        this.position = {
            x: 250,
            y: 300,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 25;
        this.height = 25;
        this.sides = {
            bottom: this.position.y + this.height,
        };
        this.gravity = 1;
        this.colisionBlock = colisionBlock;
        this.ctx2 = ctx2; // cambio
    }
    checkCollisionWithEnemy(enemy) {
        if (this.position.x < enemy.position.x + enemy.width &&
            this.position.x + this.width > enemy.position.x &&
            this.position.y < enemy.position.y + enemy.height &&
            this.position.y + this.height > enemy.position.y) {
            return true;
        }
        return false;
    }

    draw() {
        this.ctx2.fillStyle = "red"; // cambio
        this.ctx2.fillRect(this.position.x, this.position.y, this.width, this.height); // cambio
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.checkHorizontalColision();
        this.applyGravity(); // typo corrected from `aplyGravity` to `applyGravity`
        this.checkVerticalColision();
    }

    checkHorizontalColision() {
        for (let i = 0; i < this.colisionBlock.length; i++) {
            const colisionBlock = this.colisionBlock[i];

            if (this.position.x <= colisionBlock.position.x + colisionBlock.width &&
                this.position.x + this.width >= colisionBlock.position.x &&
                this.position.y + this.height >= colisionBlock.position.y &&
                this.position.y <= colisionBlock.position.y + colisionBlock.height) {
                if (this.velocity.x < 0) {
                    this.position.x = colisionBlock.position.x + colisionBlock.width + 0.01;
                    break;
                }
                if (this.velocity.x > 0) {
                    this.position.x = colisionBlock.position.x - this.width - 0.01;
                    break;
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
    }

    checkVerticalColision() {
        for (let i = 0; i < this.colisionBlock.length; i++) {
            const colisionBlock = this.colisionBlock[i];

            if (this.position.x <= colisionBlock.position.x + colisionBlock.width &&
                this.position.x + this.width >= colisionBlock.position.x &&
                this.position.y + this.height >= colisionBlock.position.y &&
                this.position.y <= colisionBlock.position.y + colisionBlock.height) {

                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    this.position.y = colisionBlock.position.y + colisionBlock.height + 0.01;
                    break;
                }
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    this.position.y = colisionBlock.position.y - this.height - 0.01;
                    break;
                }
            }
        }
    }
}
