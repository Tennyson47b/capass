let canvasWidth = 800;
let canvasHeight = 800;

//rojosNegros
let miCapa1;
let imagenActualCapa1; // Variable para almacenar la imagen actual
let capa1RojasNegras;
let rojasNegrasPhaseTime = 500; // Tiempo en milisegundos para la fase celeste
let rojasNegrasPhaseActive = true;

// Amarillas
let customImages = [];
let capa2Amarillas;
let yellowPhaseTime = 2000; // Tiempo en milisegundos para la fase amarilla
let yellowPhaseActive = false;

//lilas
let lilas = [];
let capa3Lilas;
let lilacPhaseTime = 3000; // Tiempo en milisegundos para la fase lila
let lilacPhaseActive = false;

//celeste
let celestes;
let capa4Celestes;
let celestePhaseTime = 5000; // Tiempo en milisegundos para la fase celeste
let celestePhaseActive = false;

//naranjasGrises
let miCapa5;
let imagenActual; // Variable para almacenar la imagen actual
let capa5Naranjas;
let naranjasGrisesPhaseTime = 500; // Tiempo en milisegundos para la fase celeste
let naranjasGrisesPhaseActive = false;

// Tiempo actual en milisegundos
let currentTime = 0;

//-------CONFIGURACION----

let AMP_MIN = 0.01; // umbral mínimo de amplitud. Señal que supera al ruido de fondo
let AMP_MAX = 0.06; // umbral máximo de amplitud. 
let FREC_MIN = 100;
let FREC_MAX = 700;

let IMPRIMIR = false; //variable de monitoreo de lq info del sonido

//-----ENTRADA DE AUDIO----
let mic;

//-----AMPLITUD----

let amp;
let haySonido = false;
let antesHabiaSonido = false;

//----FRECUENCIA -----
let audioContext; //motor de audio del navegador
let frecuencia; //variable donde cargo los valores de frecuencia del sonido de entrada
let frecuenciaAnterior; //memoria de la variable "frecuencia". Guarda el valor de la variable en fotograma anterior
let difDeFrecuencia; // diferencia de frecuencia entre el fotograma actual y el anterior
const pichModel = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';


function setup() {
  createCanvas(canvasWidth, canvasHeight);
  
  //capa1RojasNegras = createGraphics(width, height);
  capa2Amarillas = createGraphics(width, height);
  capa3Lilas = createGraphics(width, height);
  capa4Celestes = createGraphics(width, height);
 

  //rojosNegros
  // Inicializar una instancia de la clase Imagenes
  miCapa1 = new Capa1();
  // Obtener una imagen aleatoria del arreglo
  imagenActualCapa1 = miCapa1.obtenerImagenAleatoria();

  // Amarillas
  let numImages = random() < 0.5 ? 1 : 2; // Determina si se generan 1 o 2 imágenes
  
  for (let i = 0; i < numImages; i++) {
    let customImage = new CustomImage(random(width), random(0, 400));
    customImages.push(customImage);
  }

  //lilas
  let numLilas;
  if (random() < 0.15) { // 25% de las veces crear 3 elipses
    numLilas = 3;
  } else {
    numLilas = 2;
  }
  for (let i = 0; i < numLilas; i++) {
    let l = new Lila();
    while (l.checkOverlap()) {
      l = new Lila();
    }
    lilas.push(l);
  }

  //celestes
  celestes = new Celestes();

  //naranjasGrises
  // Inicializar una instancia de la clase Imagenes
  miCapa5 = new Capa5();
  // Obtener una imagen aleatoria del arreglo
  imagenActual = miCapa5.obtenerImagenAleatoria();

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);

  userStartAudio(); // esto lo utilizo porque en algunos navigadores se cuelga el audio. Esto hace un reset del motor de audio (audio context)

}

function draw() {
  background(255);
  //imprimirData()
  amp = mic.getLevel();
  haySonido = amp > AMP_MIN;
  difDeFrecuencia = frecuencia - frecuenciaAnterior;

  currentTime += deltaTime;
// Mostrar la capa 1 de rojas negras
if (rojasNegrasPhaseActive) {
  image(imagenActualCapa1, 0, 0, 800, 800);
  if (currentTime >= rojasNegrasPhaseTime) {
    rojasNegrasPhaseActive = false;
    yellowPhaseActive = true;
    currentTime = 0;
  }
}

// Mostrar la capa 2 de amarillas
if (yellowPhaseActive) {
  for (let i = 0; i < customImages.length; i++) {
    customImages[i].showImage(capa2Amarillas);
    customImages[i].updatePosition();
  }
  if (currentTime >= yellowPhaseTime) {
    yellowPhaseActive = false;
    lilacPhaseActive = true;
    currentTime = 0;
  }
}

// Mostrar la capa 3 de lilas
if (lilacPhaseActive) {
  for (let l of lilas) {
    l.updateTransparency();
    l.draw(capa3Lilas);
  }
  if (currentTime >= lilacPhaseTime) {
    lilacPhaseActive = false;
    celestePhaseActive = true;
    currentTime = 0;
  }
}

// Mostrar la capa 4 de celestes
if (celestePhaseActive) {
  celestes.updatePosition();
  celestes.checkDistances();
  celestes.dibujar(capa4Celestes);
  if (currentTime >= celestePhaseTime) {
    celestePhaseActive = false;
    yellowPhaseActive=true;
    currentTime = 0;
  }
}

// Mostrar la capa 5 de naranjas grises
if (naranjasGrisesPhaseActive) {
  image(imagenActual, 0, 0, 800, 800);
  if (currentTime >= naranjasGrisesPhaseTime) {
    naranjasGrisesPhaseActive = false;
    yellowPhaseActive=true;
    currentTime=0;
  }
}
else{
    image(imagenActualCapa1, 0, 0, 800, 800);
    for (let i = 0; i < customImages.length; i++) {
      customImages[i].showImage(capa2Amarillas);
    }
    for (let l of lilas) {
      l.draw(capa3Lilas);
    }
    celestes.dibujar(capa4Celestes);
    image(imagenActual, 0, 0, 800, 800); 
  }
}
 
  



//-------FRECUENCIA-----
function startPitch() {
  pitch = ml5.pitchDetection(pichModel, audioContext , mic.stream, modelLoaded);
}
function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      frecuencia = frequency;
    } else {
    }
    getPitch();
  })
}
function imprimirData(){

  background(255);
  push();
  textSize(16);
  fill(0);
  let texto;
  texto = 'amplitud: ' + amp;
  text(texto, 10, 20);

  texto = 'frecuencia: ' + frecuencia;
  text(texto, 10, 40);
  pop();

}
