let cam;
let center;
let radius, theta, phi, panX, panY;
let lastMouseX, lastMouseY;
let dragging = false;
let panning = false;
let lastDist = null;
let lastTouchCenter = null;
let skyTexture, paredTexture;

// Posición inicial de la cámara
const initialCamera = {
  radius: 600,
  theta: Math.PI / 3,
  phi: Math.PI / 2,
  panX: 0,
  panY: 0
};

// Para animación de regreso
let returning = false;
let returnStart = {};
let returnT = 0;

// Modo de cámara: true = vuelve, false = libre
let cameraReturnMode = true;

function preload() {
  skyTexture = loadImage('img/sky.jpg');
  paredTexture = loadImage('img/textura.jpg');
}

function setup() {
  createCanvas(600, 800, WEBGL);
  cam = createCamera();
  center = [0, 0, 0];

  // Posición inicial de la cámara
  radius = initialCamera.radius;
  theta = initialCamera.theta;
  phi = initialCamera.phi;
  panX = initialCamera.panX;
  panY = initialCamera.panY;

  updateCamera(); // <-- Esta llamada debe funcionar

  // Configura el ícono HTML
  setupCameraToggleIcon();
  updateCameraToggleIcon();
}

function draw() {
  // Skybox
   noStroke();
  push();
 
  if (skyTexture) {
    texture(skyTexture);
    push();
    scale(-1, 1, 1);
    sphere(3000, 60, 40);
    pop();
  } else {
    background(100, 150, 255);
  }
  pop();

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

  // Si está volviendo, interpolar con ease
  if (returning) {
    returnT += 0.03;
    let e = easeOutQuad(constrain(returnT, 0, 1));
    theta = lerp(returnStart.theta, initialCamera.theta, e);
    phi = lerp(returnStart.phi, initialCamera.phi, e);
    radius = lerp(returnStart.radius, initialCamera.radius, e);
    panX = lerp(returnStart.panX, initialCamera.panX, e);
    panY = lerp(returnStart.panY, initialCamera.panY, e);
    if (returnT >= 1) {
      returning = false;
      returnT = 0;
    }
  }

  updateCamera();
  document.oncontextmenu = function () {
    return false;
  };
}

// Configura el ícono HTML
function setupCameraToggleIcon() {
  const iconDiv = document.getElementById('camera-toggle');
  iconDiv.addEventListener('click', () => {
    cameraReturnMode = !cameraReturnMode;
    updateCameraToggleIcon();
    returning = false;
  });
}

function updateCameraToggleIcon() {
  const iconDiv = document.getElementById('camera-toggle');
  iconDiv.classList.toggle('locked', cameraReturnMode);
  iconDiv.classList.toggle('unlocked', !cameraReturnMode);
  iconDiv.innerHTML = cameraReturnMode
    ? `<svg viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="8" ry="7" stroke="#fff" stroke-width="2" fill="none"/><path d="M10 20 v-5a6 6 0 1 1 12 0v5" stroke="#fff" stroke-width="2" fill="none"/><rect x="13" y="22" width="6" height="4" rx="2" fill="#fff"/></svg>`
    : `<svg viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="8" ry="7" stroke="#fff" stroke-width="2" fill="none"/><path d="M10 20 v-5a6 6 0 1 1 12 0" stroke="#fff" stroke-width="2" fill="none"/><rect x="13" y="22" width="6" height="4" rx="2" fill="#fff"/></svg>`;
}

function draw() {
  // Skybox
   noStroke();
  push();
 
  if (skyTexture) {
    texture(skyTexture);
    push();
    scale(-1, 1, 1);
    sphere(3000, 60, 40);
    pop();
  } else {
    background(100, 150, 255);
  }
  pop();

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

  // Si está volviendo, interpolar con ease
  if (returning) {
    returnT += 0.03;
    let e = easeOutQuad(constrain(returnT, 0, 1));
    theta = lerp(returnStart.theta, initialCamera.theta, e);
    phi = lerp(returnStart.phi, initialCamera.phi, e);
    radius = lerp(returnStart.radius, initialCamera.radius, e);
    panX = lerp(returnStart.panX, initialCamera.panX, e);
    panY = lerp(returnStart.panY, initialCamera.panY, e);
    if (returnT >= 1) {
      returning = false;
      returnT = 0;
    }
  }

  updateCamera();
  document.oncontextmenu = function () {
    return false;
  };
}

// Mouse controles
function mousePressed() {
  // Ya NO debe haber chequeo de mouseOnIcon ni nada similar
  if (mouseButton === LEFT) {
    dragging = true;
  } else if (mouseButton === RIGHT) {
    panning = true;
  }
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  returning = false;
  return false;
}

function mouseDragged() {
  let dx = mouseX - lastMouseX;
  let dy = mouseY - lastMouseY;
  if (dragging) {
    theta -= dx * 0.01;
    phi -= dy * 0.01;
    phi = constrain(phi, 0.05, Math.PI - 0.05);
  }
  if (panning) {
    panX -= dx * 0.5;
    panY += dy * 0.5;
  }
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  dragging = false;
  panning = false;
  if (cameraReturnMode) startReturn();
}

function mouseWheel(event) {
  radius += event.delta * 0.5;
  radius = constrain(radius, 50, 2000);
  returning = false;
  return false;
}

// Touch controles
function touchStarted() {
  if (touches.length === 1) {
    dragging = true;
    lastMouseX = touches[0].x;
    lastMouseY = touches[0].y;
  } else if (touches.length === 2) {
    panning = true;
    lastDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    lastTouchCenter = {
      x: (touches[0].x + touches[1].x) / 2,
      y: (touches[0].y + touches[1].y) / 2
    };
  }
  returning = false;
  return false;
}

function touchMoved() {
  if (touches.length === 1 && dragging) {
    let dx = touches[0].x - lastMouseX;
    let dy = touches[0].y - lastMouseY;
    theta -= dx * 0.01;
    phi -= dy * 0.01;
    phi = constrain(phi, 0.05, Math.PI - 0.05);
    lastMouseX = touches[0].x;
    lastMouseY = touches[0].y;
  } else if (touches.length === 2 && panning) {
    let centerNow = {
      x: (touches[0].x + touches[1].x) / 2,
      y: (touches[0].y + touches[1].y) / 2
    };
    let dx = centerNow.x - lastTouchCenter.x;
    let dy = centerNow.y - lastTouchCenter.y;
    panX -= dx * 0.5;
    panY += dy * 0.5;
    lastTouchCenter = centerNow;
    let d = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    let zoomDelta = d - lastDist;
    radius -= zoomDelta * 1.0;
    radius = constrain(radius, 50, 2000);
    lastDist = d;
  }
  return false;
}

function touchEnded() {
  if (touches.length < 2) {
    panning = false;
    lastDist = null;
    lastTouchCenter = null;
  }
  if (touches.length === 0) {
    dragging = false;
    if (cameraReturnMode) startReturn();
  }
}

function startReturn() {
  // Guarda el estado actual para interpolar
  returnStart = {
    theta: theta,
    phi: phi,
    radius: radius,
    panX: panX,
    panY: panY
  };
  returnT = 0;
  returning = true;
}

// Easing cuadrático de salida
function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    cameraReturnMode = !cameraReturnMode;
    returning = false;
    updateCameraToggleIcon(); // <- ¡Esto es lo importante!
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Debe estar definida así:
function updateCamera() {
  let x = center[0] + radius * sin(phi) * cos(theta) + panX;
  let y = center[1] + radius * cos(phi) + panY;
  let z = center[2] + radius * sin(phi) * sin(theta);
  cam.setPosition(x, y, z);
  cam.lookAt(center[0] + panX, center[1] + panY, center[2]);
  cam.upX = 0;
  cam.upY = 1;
  cam.upZ = 0;
}
