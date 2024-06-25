class CustomImage {
  constructor(x, y) {
    this.imageX = x;
    this.imageY = y;
    this.maxImages = 9;
    this.imageIndex = Math.floor(Math.random() * this.maxImages);
    this.images = [];
    for (let i = 0; i < this.maxImages; i++) {
      this.images[i] = loadImage("data/capa2Amarillas/amarillas" + nf(i, 2) + ".png");
    }
  }

  showImage() {
    image(this.images[this.imageIndex], this.imageX, this.imageY);
  }

  updatePosition() {
//alto volumen baja y
if (amp>AMP_MAX/2 ){
this.imageY=this.imageY-5;
}
//bajo volumen sube y
if(amp<AMP_MAX/2 && amp>AMP_MIN){
  this.imageY=this.imageY+5;
}

if (haySonido==true){

//agudo izquierda baja x
if (frecuencia>FREC_MAX/2 ){
  this.imageX=this.imageX-5;
  }
  //grave derecha sube x
if(frecuencia<FREC_MAX/2 && frecuencia>FREC_MIN){
  this.imageX=this.imageX+5;
}
}

    //maximo que sale del canvas
    this.imageX = min(max(this.imageX, -this.images[this.imageIndex].width / 2), width - this.images[this.imageIndex].width / 2);
    this.imageY = min(max(this.imageY, -this.images[this.imageIndex].height / 2), height - this.images[this.imageIndex].height / 2);

    
    // Verificar colisiones con otras imágenes
    for (let i = 0; i < customImages.length; i++) {
      if (customImages[i] !== this) {
        let distance = dist(this.imageX, this.imageY, customImages[i].imageX, customImages[i].imageY);
        let minDistance = this.images[this.imageIndex].width / 2 + customImages[i].images[customImages[i].imageIndex].width / 2;
        if (distance < minDistance) {
          // Hay colisión, ajustar posición
          let angle = atan2(this.imageY - customImages[i].imageY, this.imageX - customImages[i].imageX);
          let targetX = customImages[i].imageX + cos(angle) * minDistance;
          let targetY = customImages[i].imageY + sin(angle) * minDistance;
          this.imageX = targetX;
          this.imageY = targetY;
        }
      }
    }
  }
}






