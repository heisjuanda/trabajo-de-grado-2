export class ColisionBlock { // Asegúrate de que "export" esté presente
    constructor({ position, ctx2 }) { // Asegúrate de que ctx2 se pase al constructor
        this.position = position;
        this.width = 64;
        this.height = 64;
        this.ctx2 = ctx2; // cambio
    }

    draw() {
        this.ctx2.fillStyle = 'rgba(255,0,0,0.5)';
        this.ctx2.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}