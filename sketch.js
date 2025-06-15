let cam;
let paredTexture;

function preload() {
  paredTexture = loadImage('img/textura.jpg'); // Cambia el nombre si tu textura es otra
}

function setup() {
  createCanvas(600, 800, WEBGL);
  frameRate(60);
  cam = createCamera();
}

function draw() {
  background(20);
  noCursor();
  noStroke();
  // Control de cámara: mouse arrastrado = orbitar, si no, vista fija
  if (!mouseIsPressed) {
    camera(0, 0, 500, 0, 0, 0);
  }
  document.oncontextmenu = function () {
    return false;
  };

  // Centrar y girar la escena 45 grados para que la esquina apunte a la cámara
  rotateY(-1);

  // SUELO
  push();
  translate(0, 100, 0); // Baja el suelo
  rotateX(HALF_PI);     // Acuesta el plano
  texture(paredTexture);
  plane(200, 200);
  pop();

  // PARED IZQUIERDA
  push();
  translate(-100, 0, 0); // Mueve a la izquierda
  rotateY(HALF_PI);       // Gira para que sea pared
  texture(paredTexture);
  plane(200, 200);
  pop();

  // PARED DERECHA
  push();
  translate(0, 0, -100); // Mueve hacia atrás
  // No necesita rotación, ya está de frente
  texture(paredTexture);
  plane(200, 200);
  pop();
}

function mouseDragged() {
  orbitControl();
}
