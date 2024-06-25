class Capa1 {
    constructor() {
      // Arreglo de imágenes
      this.imagenes = [];
      // Cargar las imágenes en el arreglo
      for (let i = 0; i < 7; i++) {
        let img = loadImage('data/capa1/rojasNegras' + nf(i, 2) + '.png');
        this.imagenes.push(img);
      }
    }
  
    obtenerImagenAleatoria() {
      // Obtener una imagen aleatoria del arreglo
      let imagenAleatoria = random(this.imagenes);
      return imagenAleatoria;
    }
  }