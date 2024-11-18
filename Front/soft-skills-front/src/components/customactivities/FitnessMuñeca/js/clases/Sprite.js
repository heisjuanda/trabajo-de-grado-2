/* Esta clase sirve para cargar los modelos de varis objetos */
export class Sprite {
    constructor({ position, imageSrc, ctx2 }) {
      this.position = position;
      this.imageSrc = imageSrc;
      this.ctx2 = ctx2;
      this.image = new Image();
      this.image.src = this.imageSrc;
      this.loaded = false; // inicializar como false
      this.image.onload = () => {
        console.log(`Image ${this.imageSrc} loaded successfully`);
        this.loaded = true; // marcar como cargada
      };
      this.image.onerror = () => {
        console.error(`Failed to load image: ${this.imageSrc}`);
      };
    }
  
    draw() {
      if (this.loaded) {
        this.ctx2.drawImage(this.image, this.position.x, this.position.y);
      } else {
        console.log('Image not loaded yet');
      }
    }
  }
  