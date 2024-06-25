class Celestes {
  constructor() {
    this.imagenes = [];
    for (let i = 1; i <= 11; i++) {
      this.imagenes.push(loadImage("data/capa4Celestes/azules" + nf(i, 2) + ".png"));
    }
    this.numImagenes = floor(random(1, 5)); // Seleccionar aleatoriamente entre 1 y 4 imágenes
    this.posiciones = []; // Array para guardar las posiciones de las imágenes
    this.imagenesMostradas = []; // Array para almacenar las imágenes mostradas actualmente
    // Generar posiciones y seleccionar imágenes únicas
    while (this.posiciones.length < this.numImagenes) {
      let nuevaPosicion = createVector(random(0, width), random(0, height));
      let imagenIndex = floor(random(this.imagenes.length));

      let esUnica = true;
      for (let i = 0; i < this.posiciones.length; i++) {
        if (p5.Vector.dist(nuevaPosicion, this.posiciones[i]) < 200 || this.imagenesMostradas[i] === imagenIndex) {
          esUnica = false;
          break;
        }
      }

      if (esUnica) {
        this.posiciones.push(nuevaPosicion);
        this.imagenesMostradas.push(imagenIndex);
      }
    }
    this.minDistance = 500; // Distancia mínima entre las imágenes
  }

  dibujar() {
    for (let i = 0; i < this.numImagenes; i++) {
      let imagenIndex = this.imagenesMostradas[i];
      image(this.imagenes[imagenIndex], this.posiciones[i].x, this.posiciones[i].y);
    }
  }

  updatePosition() {
    //let mouseXDiff = mouseX - width / 2;
    //let mouseYDiff = mouseY - height / 2;
    //let moveX = mouseXDiff * 0.05;
    //let moveY = mouseYDiff * 0.05;
   
      for (let i = 0; i < this.numImagenes; i++) {
        let imageX = this.posiciones[i].x;
        let imageY = this.posiciones[i].y;
    
        imageX = min(max(imageX, -this.imagenes[i].width / 2), width - this.imagenes[i].width / 2);
        imageY = min(max(imageY, -this.imagenes[i].height / 2), height - this.imagenes[i].height / 2);
    
        if (amp > AMP_MAX / 2) {
          // Alto volumen, baja Y
          imageY -= 5;
        } else if (amp > AMP_MIN) {
          // Bajo volumen, sube Y
          imageY += 5;
        }
    
        if (haySonido) {
          if (frecuencia > FREC_MAX / 2) {
            // Agudo, baja X
            imageX -= 5;
          } else if (frecuencia > FREC_MIN) {
            // Grave, sube X
            imageX += 5;
          }
        }
    
        this.posiciones[i] = createVector(imageX, imageY);
      }
    }

  checkDistances() {
    for (let i = 0; i < this.numImagenes; i++) {
      for (let j = i + 1; j < this.numImagenes; j++) {
        let distance = dist(
          this.posiciones[i].x,
          this.posiciones[i].y,
          this.posiciones[j].x,
          this.posiciones[j].y
        );

        if (distance < this.minDistance) {
          let direction = p5.Vector.sub(this.posiciones[i], this.posiciones[j]);
          direction.setMag(this.minDistance - distance);

          this.posiciones[i].add(direction);
          this.posiciones[j].sub(direction);
        }
      }
    }
  }

}