class Lila {
  constructor() {
    let numLilas = floor(random(2, 4));
    this.diameter = 300;
    this.minTransparency = random(80, 150); // Valor mínimo de transparencia personalizado
    this.maxTransparency = random(150, 210); // Valor máximo de transparencia personalizado

    let pos = random(4);
    if (pos < 1) { // lateral superior
      this.x = random(0, width);
      this.y = random(0, 100);
    } else if (pos < 2) { // lateral derecho
      this.x = random(700, width);
      this.y = random(0, height);
    } else if (pos < 3) { // lateral inferior
      this.x = random(0, width);
      this.y = random(700, height);
    } else { // lateral izquierdo
      this.x = random(0, 100);
      this.y = random(0, height);
    }
    this.overlap = false;
    this.transparency = random(this.minTransparency, this.maxTransparency); // Asignar un valor aleatorio dentro del rango de transparencia
  }

  draw() {
    noStroke();
    fill(175, 130, 232, this.transparency); // Utilizar el valor de transparencia personalizado
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  checkOverlap() {
    for (let l of lilas) {
      if (l !== this) {
        let distance = dist(this.x, this.y, l.x, l.y);
        if (distance < (this.diameter / 2 + l.diameter / 2)) {
          return true;
        }
      }
    }
    return false;
  }
  
  updateTransparency() {
    let mouseYRatio = frecuencia / height; // Relación de la posición Y del mouse respecto a la altura del lienzo
    this.transparency = map(mouseYRatio, 0, 1, this.maxTransparency, this.minTransparency); // Mapear el valor de transparencia basado en la posición del mouse
  }
}