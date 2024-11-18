/* esta clase calcula las coliciones en forma de bloques de 64x64 pixeles */
export class ColisionBlock { 
    constructor({ position, ctx2 }) { 
        this.position = position;
        this.width = 64;
        this.height = 64;
        this.ctx2 = ctx2; 
    }

    draw() {
        this.ctx2.fillStyle = 'rgba(255,0,0,0.5)';
        this.ctx2.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}