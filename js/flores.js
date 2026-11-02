/* Motor 3D ASCII propio: mallas paramétricas, perspectiva, z-buffer y luz por normales. */

// Personaliza esta clave con la fecha o palabra secreta que quieras usar.
const CLAVE_SECRETA = "06/09/2026";
const gatekeeper = document.getElementById("gatekeeper");
const formClave = document.getElementById("form-clave");
const inputClave = document.getElementById("clave-secreta");
const errorClave = document.getElementById("error-clave");
const contenidoRegalo = document.getElementById("contenido-regalo");
const RAMPA = " .,:;-=+*x#%&@MW";
const PI2 = Math.PI * 2;
const DURACION = 10;
const LUZ = normalizar([-.48, .62, .78]);
const CAMARA = 1700;
const DISTANCIA_FOCAL = 1500;
const coloresHex = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const TIPOS_FLORES = Array(17).fill("lirio");
const POSICIONES_CUPULA = [
  [-490, 180, -80], [-350, 300, -100], [-185, 405, -90], [0, 460, -110], [185, 405, -90], [350, 300, -100], [490, 180, -80],
  [-410, 260, 0], [-225, 370, 35], [0, 415, 45], [225, 370, 35], [410, 260, 0],
  [-320, 185, 105], [-160, 245, 150], [0, 290, 185], [160, 245, 150], [320, 185, 105],
];
const PALETA_CARMESI = ["#7f1028", "#e51d3e", "#ff7a72", "#ffe17b"];
const PALETA_MAGENTA = ["#741044", "#f3269b", "#ff9cda", "#fff0a6"];
const PALETA_PERLA = ["#786c55", "#e8dfc7", "#fff9e9", "#ffdc83"];
const PALETA_AMARILLA = ["#725000", "#ffd400", "#fff47a", "#fff2a0"];
const PALETA_VINO = ["#42102c", "#941b50", "#df668c", "#ffd187"];
const PALETAS_RAMO = [PALETA_AMARILLA, PALETA_MAGENTA, PALETA_VINO, PALETA_CARMESI, PALETA_PERLA];
const ASIGNACION_PALETA = [0, 1, 4, 3, 2, 1, 0, 4, 1, 4, 1, 4, 0, 1, 4, 1, 2];
const BASE_RAMO_Y = -260;

const FLORES = [
  { x: -340, y: 90, z: -65, baseX: -104, size: 61, color: ["#421d2a", "#bb3d58", "#ff806b", "#ffd66f"], orden: 6, petalos: 15, capas: 3, onda: .35 },
  { x: -275, y: 270, z: 18, baseX: -82, size: 70, color: ["#45143e", "#bd398e", "#ff8bc4", "#ffe5a0"], orden: 4, petalos: 16, capas: 3, onda: .6 },
  { x: -205, y: 440, z: -48, baseX: -63, size: 76, color: ["#4c1f12", "#d25b2e", "#ffbd55", "#fff0a6"], orden: 2, petalos: 14, capas: 3, onda: .2 },
  { x: -115, y: 565, z: 62, baseX: -42, size: 69, color: ["#321d5d", "#7451c7", "#c6a0ff", "#fff0bb"], orden: 0, petalos: 18, capas: 3, onda: .55 },
  { x: 12, y: 480, z: -72, baseX: -18, size: 82, color: ["#4b2812", "#d96a34", "#ffc15f", "#fff1a8"], orden: 1, petalos: 16, capas: 3, onda: .45 },
  { x: 135, y: 530, z: 28, baseX: 12, size: 75, color: ["#401735", "#b52e71", "#ff74aa", "#ffe9ad"], orden: 1, petalos: 19, capas: 3, onda: .7 },
  { x: 245, y: 390, z: -36, baseX: 42, size: 72, color: ["#193b43", "#188b91", "#71e0ca", "#f3ffb1"], orden: 3, petalos: 14, capas: 3, onda: .3 },
  { x: 335, y: 220, z: 48, baseX: 77, size: 63, color: ["#3e2a0c", "#c58e19", "#ffe45a", "#fff8bb"], orden: 5, petalos: 16, capas: 3, onda: .5 },
  { x: -365, y: -45, z: 35, baseX: -112, size: 56, color: ["#311e57", "#6845b2", "#ad8fff", "#ffe2a0"], orden: 7, petalos: 14, capas: 3, onda: .25 },
  { x: -65, y: 260, z: 105, baseX: -26, size: 58, color: ["#4c102e", "#d52265", "#ff6f90", "#ffe8a0"], orden: 5, petalos: 19, capas: 3, onda: .68 },
  { x: 290, y: 55, z: 102, baseX: 62, size: 57, color: ["#391b2c", "#a84b73", "#f5a5bf", "#fff0be"], orden: 7, petalos: 14, capas: 3, onda: .4 },
  { x: -40, y: 260, z: -20, baseX: -14, size: 76, color: [], orden: 3, onda: .48 },
  { x: 45, y: 285, z: 22, baseX: 16, size: 72, color: [], orden: 4, onda: .52 },
  { x: -75, y: 240, z: 70, baseX: -22, size: 69, color: [], orden: 5, onda: .58 },
  { x: 82, y: 250, z: 85, baseX: 25, size: 74, color: [], orden: 2, onda: .46 },
  { x: 20, y: 315, z: -40, baseX: 7, size: 79, color: [], orden: 1, onda: .5 },
  { x: -18, y: 195, z: 120, baseX: -5, size: 68, color: [], orden: 6, onda: .62 },
].map((f, i) => ({
  ...f,
  // Cúpula de lirios orientales; paletas alternadas por planos del ramo.
  x: POSICIONES_CUPULA[i][0],
  y: POSICIONES_CUPULA[i][1],
  z: POSICIONES_CUPULA[i][2],
  baseX: POSICIONES_CUPULA[i][0] * .1,
  size: f.size * 1.13,
  inclinacionX: (i % 3 - 1) * .07,
  inclinacionY: -POSICIONES_CUPULA[i][0] / 500 * .2,
  tipo: TIPOS_FLORES[i],
  color: PALETAS_RAMO[ASIGNACION_PALETA[i]],
  petalos: 6,
  capas: 2,
  paleta: PALETAS_RAMO[ASIGNACION_PALETA[i]].map(coloresHex),
  semilla: i * 127 + 31,
  talloInicio: .2 + (i % 3) * .055,
  abrirInicio: 1.15 + f.orden * .13,
  abrirDuracion: 1.05 + (i % 4) * .055,
  abrirForzado: null,
  onda: .5 + f.onda * .25,
  hojas: [
    { u: .18, lado: i % 2 ? 1 : -1, largo: 102 + (i % 3) * 10, ancho: 17 },
    { u: .42, lado: i % 2 ? -1 : 1, largo: 92 + (i % 4) * 8, ancho: 16 },
    { u: .67, lado: i % 2 ? 1 : -1, largo: 72 + (i % 3) * 8, ancho: 13 },
  ],
}));

const TODAS_LAS_FLORES = FLORES;

const lienzo = document.getElementById("ramo");
const ctx = lienzo.getContext("2d", { alpha: true });
const musica = document.getElementById("bg-music");
const musicaFondo = document.getElementById("fondo-music");
const botonMusica = document.getElementById("btn-musica");
const botonFlorecer = document.getElementById("btn-florecer");
const marcosPolaroid = document.querySelectorAll(".polaroid");
const dedicatoria = document.querySelector(".ascii-dedicatoria");

let ancho, alto, dpr, columnas, filas, muestrasX, muestrasY, celdaX, celdaY, celdaMuestraX, celdaMuestraY, vista;
let profundidad, bufferColor;
let inicio = 0, iniciado = false, marco = 0;
let ultimoRender = 0;
let detallesVisibles = false, reinicioDetalles = 0;

function limitar(n, a = 0, b = 1) { return Math.max(a, Math.min(b, n)); }
function suavizar(t) { const x = limitar(t); return x * x * (3 - 2 * x); }
function salida(t) { const x = limitar(t); return 1 - (1 - x) ** 3; }
function mezclar(a, b, t) { return a + (b - a) * t; }
function normalizar(v) { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); }
function cruz(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function colorEntre(a, b, t) { return a.map((x, i) => Math.round(mezclar(x, b[i], t))); }
function valorSemilla(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function raizRamo() { return BASE_RAMO_Y; }

function prepararLienzo() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  ancho = Math.round(window.innerWidth * dpr);
  alto = Math.round(window.innerHeight * dpr);
  lienzo.width = ancho;
  lienzo.height = alto;
  // Cada carácter ocupa unos 2 px CSS; el buffer conserva supersampling 2x.
  celdaX = Math.max(2, Math.round(2 * dpr));
  celdaY = celdaX;
  columnas = Math.ceil(ancho / celdaX);
  filas = Math.ceil(alto / celdaY);
  muestrasX = columnas * 2;
  muestrasY = filas * 2;
  celdaMuestraX = celdaX / 2;
  celdaMuestraY = celdaY / 2;
  profundidad = new Float32Array(muestrasX * muestrasY);
  bufferColor = new Uint8ClampedArray(muestrasX * muestrasY * 3);
  vista = Math.min(ancho / 1100, alto / 1000) * .92;
  dibujar(performance.now(), !iniciado);
}

function rotar(p, ax, ay, az) {
  let [x, y, z] = p;
  const cy = Math.cos(ay), sy = Math.sin(ay);
  [x, z] = [x * cy + z * sy, -x * sy + z * cy];
  const cx = Math.cos(ax), sx = Math.sin(ax);
  [y, z] = [y * cx - z * sx, y * sx + z * cx];
  const cz = Math.cos(az), sz = Math.sin(az);
  [x, y] = [x * cz - y * sz, x * sz + y * cz];
  return [x, y, z];
}

function puntoTallo(flor, u, tiempo) {
  const v = 1 - u;
  const raiz = raizRamo();
  const centro = [
    v * v * flor.baseX + 2 * v * u * (flor.baseX * .55 + flor.x * .44) + u * u * flor.x,
    v * v * raiz + 2 * v * u * ((raiz + flor.y) * .48) + u * u * flor.y,
    v * v * -25 + 2 * v * u * (flor.z * .35) + u * u * flor.z,
  ];
  const viento = suavizar((tiempo - 2.65) / 1.7);
  const altura = limitar((centro[1] - raiz) / 850);
  const fase = tiempo * 1.55 - centro[1] * .006 + flor.semilla;
  centro[0] += viento * Math.sin(fase) * 24 * altura * altura;
  centro[2] += viento * Math.cos(fase * .72) * 8 * altura;
  return centro;
}

function añadirTriangulo(malla, a, b, c, color) {
  malla.push([a, b, c, color]);
}

function añadirCuadricula(malla, puntos, color) {
  for (let i = 0; i < puntos.length - 1; i++) {
    for (let j = 0; j < puntos[i].length - 1; j++) {
      const a = puntos[i][j], b = puntos[i + 1][j], c = puntos[i + 1][j + 1], d = puntos[i][j + 1];
      añadirTriangulo(malla, a, b, d, color);
      añadirTriangulo(malla, b, c, d, color);
    }
  }
}

function tubo(malla, desde, hasta, radio, color, lados = 5) {
  const eje = normalizar([hasta[0] - desde[0], hasta[1] - desde[1], hasta[2] - desde[2]]);
  let lateral = normalizar(cruz(eje, [0, 0, 1]));
  if (Math.hypot(...lateral) < .01) lateral = [1, 0, 0];
  const vertical = normalizar(cruz(eje, lateral));
  const aroA = [], aroB = [];
  for (let i = 0; i <= lados; i++) {
    const a = i / lados * Math.PI * 2;
    const ox = (lateral[0] * Math.cos(a) + vertical[0] * Math.sin(a)) * radio;
    const oy = (lateral[1] * Math.cos(a) + vertical[1] * Math.sin(a)) * radio;
    const oz = (lateral[2] * Math.cos(a) + vertical[2] * Math.sin(a)) * radio;
    aroA.push([desde[0] + ox, desde[1] + oy, desde[2] + oz]);
    aroB.push([hasta[0] + ox, hasta[1] + oy, hasta[2] + oz]);
  }
  for (let i = 0; i < lados; i++) {
    const tono = .78 + .34 * Math.max(0, Math.cos(((i + .5) / lados) * PI2 - .8));
    const colorCara = color.map((c) => Math.min(255, Math.round(c * tono)));
    añadirTriangulo(malla, aroA[i], aroB[i], aroB[i + 1], colorCara);
    añadirTriangulo(malla, aroA[i], aroB[i + 1], aroA[i + 1], colorCara);
  }
}

function mallaTallo(malla, flor, tiempo, crecimiento) {
  if (crecimiento <= 0) return;
  const segmentos = 20;
  const puntos = [];
  for (let i = 0; i <= segmentos; i++) puntos.push(puntoTallo(flor, Math.min(crecimiento, i / segmentos), tiempo));
  const hasta = Math.ceil(crecimiento * segmentos);
  for (let i = 0; i < hasta; i++) {
    const color = i % 3 === 0 ? [112, 205, 74] : [48, 151, 55];
    tubo(malla, puntos[i], puntos[i + 1], 7.2 - i / segmentos * 1.15, color, 7);
  }

  const faseHojas = suavizar((tiempo - 2) / 4);
  flor.hojas.forEach((hoja, indice) => {
    const u = hoja.u;
    const brote = limitar((crecimiento - u) / .18) * faseHojas;
    if (brote <= 0) return;
    const raiz = puntoTallo(flor, u, tiempo);
    const tip = puntoTallo(flor, Math.min(1, u + .01), tiempo);
    const tangente = normalizar([tip[0] - raiz[0], tip[1] - raiz[1], tip[2] - raiz[2]]);
    const direccion = normalizar([hoja.lado * .82 + tangente[0] * .16, .24 + tangente[1] * .12, .18 + tangente[2] * .12]);
    const ancho = normalizar(cruz([0, 0, 1], direccion));
    const mallaHoja = [];
    const pasosL = 14, pasosA = 5, largo = hoja.largo * salida(brote), anchoMax = hoja.ancho * 1.35 * salida(brote);
    for (let i = 0; i <= pasosL; i++) {
      const uHoja = i / pasosL;
      const forma = Math.pow(Math.sin(Math.PI * uHoja), .72);
      const fila = [];
      for (let j = 0; j <= pasosA; j++) {
        const v = j / pasosA * 2 - 1;
        const w = anchoMax * forma * v;
        fila.push([
          raiz[0] + direccion[0] * largo * uHoja + ancho[0] * w,
          raiz[1] + direccion[1] * largo * uHoja + ancho[1] * w,
          raiz[2] + direccion[2] * largo * uHoja + ancho[2] * w + 13 * forma * (1 - v * v),
        ]);
      }
      mallaHoja.push(fila);
    }
    añadirCuadricula(malla, mallaHoja, indice % 2 ? [71, 164, 61] : [92, 189, 67]);
  });
}

function mallaHojasRamo(malla, tiempo) {
  if (tiempo < 0) return;
  const crecimiento = suavizar(tiempo / 2);
  // Lecho frondoso en abanico: muchas hojas anchas ocultan los huecos de la base.
  for (let i = 0; i < 88; i++) {
    const sem = i * 23.17 + 11;
    const angulo = valorSemilla(sem) * PI2;
    const radioBase = 8 + valorSemilla(sem + 1) * 78;
    const baseX = Math.cos(angulo) * radioBase, baseZ = Math.sin(angulo) * radioBase * .68;
    const largo = (118 + valorSemilla(sem + 2) * 170) * crecimiento;
    const salidaLateral = 35 + valorSemilla(sem + 3) * 142;
    const mallaHoja = [], pasosL = 16, pasosA = 6;
    for (let j = 0; j <= pasosL; j++) {
      const u = j / pasosL, curva = Math.sin(u * Math.PI * .5);
      const cx = baseX + Math.cos(angulo) * salidaLateral * u * u;
      const cy = BASE_RAMO_Y + largo * curva;
      const cz = baseZ + Math.sin(angulo) * salidaLateral * u * .55;
      const ancho = (14 + valorSemilla(sem + 4) * 16) * Math.sin(Math.PI * u) ** .72;
      const lateral = [-Math.sin(angulo), 0, Math.cos(angulo)];
      mallaHoja.push([-1, -.66, -.33, 0, .33, .66, 1].map((v) => [cx + lateral[0] * ancho * v, cy + 6 * (1 - v * v) * Math.sin(Math.PI * u), cz + lateral[2] * ancho * v]));
    }
    for (let j = 0; j < pasosL; j++) {
      for (let k = 0; k < pasosA; k++) {
        const a = mallaHoja[j][k], b = mallaHoja[j + 1][k], c = mallaHoja[j + 1][k + 1], d = mallaHoja[j][k + 1];
        const color = k === 3 ? [135, 235, 91] : i % 3 ? [30, 172, 65] : [55, 211, 74];
        añadirTriangulo(malla, a, b, d, color);
        añadirTriangulo(malla, b, c, d, color);
      }
    }
  }
}
function petalo(malla, centro, angulo, largo, ancho, color, capa, detalle, onda, semillaPetalo, tipo = "lirio", resolucion = 1) {
  const direccion = [Math.cos(angulo), Math.sin(angulo), 0];
  const lateral = [-Math.sin(angulo), Math.cos(angulo), 0];
  const filasMalla = [];
  // Malla densa para conservar la curvatura sin disparar el costo por cuadro.
  const segmentosL = Math.max(7, Math.round(15 * resolucion));
  const segmentosA = Math.max(5, Math.round(9 * resolucion));
  for (let i = 0; i <= segmentosL; i++) {
    const u = i / segmentosL;
    const forma = Math.pow(Math.sin(Math.PI * u), .68) * (.72 + .28 * u);
    const fila = [];
    for (let j = 0; j <= segmentosA; j++) {
      const v = j / segmentosA * 2 - 1;
      const w = ancho * forma * v;
      const arco = Math.sin(Math.PI * u);
      fila.push([
        centro[0] + direccion[0] * largo * u + lateral[0] * w,
        centro[1] + direccion[1] * largo * u + lateral[1] * w,
        centro[2] + capa + 31 * arco * (1 - v * v) - 13 * arco * v * v + 10 * arco * Math.pow(1 - Math.abs(v), 2) + onda * 3 * Math.sin(u * PI2 + semillaPetalo) * v + detalle * 8 * u,
      ]);
    }
    filasMalla.push(fila);
  }
  for (let i = 0; i < segmentosL; i++) {
    const u = (i + .5) / segmentosL;
    const colorU = u < .38 ? colorEntre(color[0], color[1], u / .38) : colorEntre(color[1], color[2], (u - .38) / .62);
    for (let j = 0; j < segmentosA; j++) {
      const a = filasMalla[i][j], b = filasMalla[i + 1][j], c = filasMalla[i + 1][j + 1], d = filasMalla[i][j + 1];
      const vMedio = (j + .5) / segmentosA * 2 - 1;
      // La nervadura y los bordes usan bandas continuas, sin motas aleatorias.
      const distanciaBorde = Math.abs(vMedio);
      const borde = distanciaBorde > .8;
      const nervio = distanciaBorde < .105
        ? colorEntre(colorU, [255, 255, 244], .78)
        : colorU;
      const pigmento = borde ? colorEntre(nervio, [255, 250, 233], .72) : nervio;
      const tono = distanciaBorde < .105 ? 1.38 : borde ? 1.14 : 1;
      const gananciaLirio = tipo === "lirio" ? 1.24 : 1;
      const colorCara = pigmento.map((componente) => Math.min(255, Math.round(componente * tono * gananciaLirio)));
      añadirTriangulo(malla, a, b, d, colorCara);
      añadirTriangulo(malla, b, c, d, colorCara);
    }
  }
}

function esfera(malla, centro, radio, color, anillos = 5, lados = 8) {
  const puntos = [];
  for (let i = 0; i <= anillos; i++) {
    const phi = -Math.PI / 2 + Math.PI * i / anillos;
    const fila = [];
    for (let j = 0; j <= lados; j++) {
      const theta = PI2 * j / lados;
      fila.push([
        centro[0] + radio * Math.cos(phi) * Math.cos(theta),
        centro[1] + radio * Math.sin(phi),
        centro[2] + radio * Math.cos(phi) * Math.sin(theta),
      ]);
    }
    puntos.push(fila);
  }
  añadirCuadricula(malla, puntos, color);
}

function centroFlor(malla, flor, abierto, escalaBrote, cabeza) {
  const radioBase = flor.tipo === "margarita" ? .19 : flor.tipo === "lirio" ? .16 : .12;
  const radio = flor.size * (radioBase + .035 * abierto) * escalaBrote;
  const centro = [cabeza[0], cabeza[1], cabeza[2] + 17];
  esfera(malla, centro, radio, flor.paleta[3], 8, 16);

  // Semillas en las margaritas y textura sutil en los centros compactos.
  const cantidadBase = flor.tipo === "margarita" ? 30 : flor.tipo === "lirio" ? 0 : 8;
  const cantidad = Math.floor(cantidadBase * abierto);
  const anguloOro = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < cantidad; i++) {
    const r = radio * .78 * Math.sqrt((i + .5) / cantidad);
    const theta = i * anguloOro + flor.semilla;
    const x = centro[0] + Math.cos(theta) * r;
    const y = centro[1] + Math.sin(theta) * r;
    const z = centro[2] + Math.sqrt(Math.max(0, radio * radio - r * r)) * .55;
    esfera(malla, [x, y, z], 1.8 + valorSemilla(i + flor.semilla) * 1.4, i % 3 ? [255, 222, 104] : [255, 246, 178], 2, 5);
  }
  const estambres = flor.tipo === "lirio" ? 6 : 0;
  for (let k = 0; k < Math.floor(estambres * abierto); k++) {
    const a = k * PI2 / 6 + flor.semilla;
    const inicio = [centro[0] + Math.cos(a) * radio * .38, centro[1] + Math.sin(a) * radio * .38, centro[2] + 2];
    const fin = [centro[0] + Math.cos(a) * radio * .92, centro[1] + Math.sin(a) * radio * .92, centro[2] + 34];
    tubo(malla, inicio, fin, 2.3, [255, 232, 166], 7);
    esfera(malla, fin, 4.8, [255, 225, 106], 5, 8);
  }
}

function mallaFlor(malla, flor, tiempo, ahora) {
  if (tiempo < 0) return { apertura: 0, centro: [flor.baseX, BASE_RAMO_Y, -20] };
  const tallo = tiempo < 2
    ? .42 * suavizar(tiempo / 2)
    : .42 + .58 * suavizar((tiempo - 2) / 4);
  mallaTallo(malla, flor, tiempo, tallo);
  const puntoCabeza = puntoTallo(flor, tallo, tiempo);
  if (tiempo < 2) return { apertura: 0, centro: puntoCabeza };
  const creceCabeza = .28 + .72 * suavizar((tiempo - 2) / 4);
  const inicioApertura = 4.8 + limitar((flor.y - 180) / 430) * .55;
  const base = suavizar((tiempo - inicioApertura) / (7 - inicioApertura));
  const forzado = flor.abrirForzado === null ? 0 : suavizar((ahora - flor.abrirForzado) / 850);
  const abierto = Math.max(base, forzado);
  const tam = flor.size * 1.22 * creceCabeza;
  const centro = [puntoCabeza[0], puntoCabeza[1], puntoCabeza[2] + 2];
  const mallaCabeza = [];
  for (let capa = 0; capa < flor.capas; capa++) {
    const n = 3;
    const radioCapa = [1, .82][capa];
    const anchoCapa = [.42, .35][capa];
    const largoPetalo = 1.48;
    const paso = mezclar(.12, PI2 / n, suavizar(abierto));
    for (let k = 0; k < n; k++) {
      const angulo = -Math.PI / 2 + (k - (n - 1) / 2) * paso + flor.orden * .07 + capa * Math.PI / n;
      const largo = tam * radioCapa * largoPetalo * mezclar(.24, 1, salida(abierto));
      const ancho = tam * anchoCapa * mezclar(.24, 1, suavizar(abierto));
      const color = flor.paleta.slice(0, 3);
      petalo(mallaCabeza, centro, angulo, largo, ancho, color, capa * 9, abierto, flor.onda, flor.semilla + k * 17 + capa * 31, flor.tipo, 1.4);
    }
  }
  centroFlor(mallaCabeza, flor, abierto, creceCabeza, centro);
  const ax = flor.inclinacionX || 0, ay = flor.inclinacionY || 0;
  const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
  const inclinar = (v) => {
    const dx = v[0] - centro[0], dy = v[1] - centro[1], dz = v[2] - centro[2];
    const x = dx * cy + dz * sy, z = -dx * sy + dz * cy;
    return [centro[0] + x, centro[1] + dy * cx - z * sx, centro[2] + dy * sx + z * cx];
  };
  for (const cara of mallaCabeza) añadirTriangulo(malla, inclinar(cara[0]), inclinar(cara[1]), inclinar(cara[2]), cara[3]);
  return { apertura: abierto, centro };
}

function construirMalla(tiempo, ahora, estatico = false) {
  const malla = [];
  const cabezas = [];
  mallaHojasRamo(malla, tiempo);
  for (let i = 0; i < TODAS_LAS_FLORES.length; i++) {
    const flor = TODAS_LAS_FLORES[i];
    const t = estatico ? -1 : tiempo;
    cabezas.push(mallaFlor(malla, flor, t, ahora));
  }
  return { malla, cabezas };
}

function proyectar(v) {
  if (CAMARA - v[2] < 50) return null;
  const perspectiva = DISTANCIA_FOCAL / (CAMARA - v[2]) * vista;
  return {
    x: ancho / 2 + v[0] * perspectiva,
    y: alto * .49 - v[1] * perspectiva,
    z: v[2],
  };
}

function normalTriangulo(a, b, c) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  return normalizar(cruz(ab, ac));
}

function rasterizarTriangulo(a, b, c, color) {
  if (!a || !b || !c) return;
  const area = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  if (Math.abs(area) < .01) return;
  const minX = limitar(Math.floor(Math.min(a.x, b.x, c.x) / celdaMuestraX), 0, muestrasX - 1);
  const maxX = limitar(Math.ceil(Math.max(a.x, b.x, c.x) / celdaMuestraX), 0, muestrasX - 1);
  const minY = limitar(Math.floor(Math.min(a.y, b.y, c.y) / celdaMuestraY), 0, muestrasY - 1);
  const maxY = limitar(Math.ceil(Math.max(a.y, b.y, c.y) / celdaMuestraY), 0, muestrasY - 1);
  if (minX > maxX || minY > maxY) return;

  const n = normalTriangulo(a.p, b.p, c.p);
  const difusa = Math.max(0, n[0] * LUZ[0] + n[1] * LUZ[1] + n[2] * LUZ[2]);
  const especular = Math.pow(Math.max(0, n[2]), 12) * .78;
  // Luz suave para evitar que cada triángulo se lea como una faceta romboidal.
  const luz = .66 + difusa * .31 + especular * .1;
  const shaded = [
    limitar(color[0] * luz, 0, 255),
    limitar(color[1] * luz, 0, 255),
    limitar(color[2] * luz, 0, 255),
  ];
  const invArea = 1 / area;
  for (let row = minY; row <= maxY; row++) {
    const py = (row + .5) * celdaMuestraY;
    for (let col = minX; col <= maxX; col++) {
      const px = (col + .5) * celdaMuestraX;
      const wa = ((b.y - c.y) * (px - c.x) + (c.x - b.x) * (py - c.y)) * invArea;
      const wb = ((c.y - a.y) * (px - c.x) + (a.x - c.x) * (py - c.y)) * invArea;
      const wc = 1 - wa - wb;
      if (wa < -.001 || wb < -.001 || wc < -.001) continue;
      const z = wa * a.z + wb * b.z + wc * c.z;
      const index = row * muestrasX + col;
      if (z <= profundidad[index]) continue;
      profundidad[index] = z;
      const k = index * 3;
      bufferColor[k] = shaded[0];
      bufferColor[k + 1] = shaded[1];
      bufferColor[k + 2] = shaded[2];
    }
  }
}

function dibujarASCII(malla, yaw, pitch, roll) {
  profundidad.fill(-Infinity);
  for (const cara of malla) {
    const a3 = rotar(cara[0], pitch, yaw, roll);
    const b3 = rotar(cara[1], pitch, yaw, roll);
    const c3 = rotar(cara[2], pitch, yaw, roll);
    const a2 = proyectar(a3), b2 = proyectar(b3), c2 = proyectar(c3);
    if (!a2 || !b2 || !c2) continue;
    a2.p = a3; b2.p = b3; c2.p = c3;
    rasterizarTriangulo(a2, b2, c2, cara[3]);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ancho, alto);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${(celdaX / .58).toFixed(2)}px ui-monospace, Consolas, "Courier New", monospace`;
  for (let row = 0; row < filas; row++) {
    const linea = Array(columnas).fill(null);
    let racha = "", colorRacha = "", inicioRacha = 0;
    const cerrarRacha = () => {
      if (!racha) return;
      ctx.fillStyle = colorRacha;
      ctx.fillText(racha, inicioRacha * celdaX, row * celdaY + celdaY / 2);
      racha = "";
    };
    for (let col = 0; col < columnas; col++) {
      let r = 0, g = 0, b = 0, ocupadas = 0;
      for (let sy = 0; sy < 2; sy++) {
        for (let sx = 0; sx < 2; sx++) {
          const muestra = (row * 2 + sy) * muestrasX + col * 2 + sx;
          if (profundidad[muestra] === -Infinity) continue;
          const k = muestra * 3;
          r += bufferColor[k]; g += bufferColor[k + 1]; b += bufferColor[k + 2];
          ocupadas++;
        }
      }
      if (!ocupadas) continue;
      const cobertura = ocupadas / 4;
      r = Math.round((r / ocupadas) * (.48 + cobertura * .52));
      g = Math.round((g / ocupadas) * (.48 + cobertura * .52));
      b = Math.round((b / ocupadas) * (.48 + cobertura * .52));
      linea[col] = { r, g, b, luma: .2126 * r + .7152 * g + .0722 * b };
    }

    // Cierra microcortes de rasterizado entre triángulos vecinos en una misma franja.
    for (let col = 0; col < columnas;) {
      if (linea[col]) { col++; continue; }
      const inicioHueco = col;
      while (col < columnas && !linea[col]) col++;
      const largoHueco = col - inicioHueco;
      if (largoHueco <= 2 && inicioHueco > 0 && col < columnas && linea[inicioHueco - 1] && linea[col]) {
        const antes = linea[inicioHueco - 1], despues = linea[col];
        for (let k = 0; k < largoHueco; k++) {
          const t = (k + 1) / (largoHueco + 1);
          const r = Math.round(mezclar(antes.r, despues.r, t));
          const g = Math.round(mezclar(antes.g, despues.g, t));
          const b = Math.round(mezclar(antes.b, despues.b, t));
          linea[inicioHueco + k] = { r, g, b, luma: .2126 * r + .7152 * g + .0722 * b };
        }
      }
    }

    for (let col = 0; col < columnas; col++) {
      const celda = linea[col];
      if (!celda) { cerrarRacha(); colorRacha = ""; continue; }
      // Suaviza luminancia sólo en horizontal: la trama mantiene filas limpias y continuas.
      let luma = 0, peso = 0;
      for (let offset = -2; offset <= 2; offset++) {
        const vecina = linea[col + offset];
        if (!vecina) continue;
        const w = 3 - Math.abs(offset);
        luma += vecina.luma * w;
        peso += w;
      }
      luma = peso ? luma / peso : celda.luma;
      const nivel = limitar(Math.round((luma / 255) * (RAMPA.length - 1)), 1, RAMPA.length - 1);
      const rgb = [celda.r, celda.g, celda.b].map((canal) => Math.min(255, Math.round(canal / 12) * 12));
      const color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      if (color !== colorRacha) {
        cerrarRacha();
        colorRacha = color;
        inicioRacha = col;
      }
      racha += RAMPA[nivel];
    }
    cerrarRacha();
  }
}

function dibujar(ahora, estatico = false) {
  const segundos = iniciado ? Math.min((ahora - inicio) / 1000, DURACION) : -1;
  const escena = construirMalla(estatico ? -1 : segundos, ahora, estatico || !iniciado);
  dibujarASCII(escena.malla, 0, .12, 0);
  if (iniciado && segundos >= 7) mostrarDetalles();
}

function ocultarDetalles() {
  const token = ++reinicioDetalles;
  document.body.classList.add("floracion-reiniciando");
  marcosPolaroid.forEach((marcoFoto) => marcoFoto.classList.remove("is-visible"));
  dedicatoria.classList.remove("is-visible");
  detallesVisibles = false;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (token === reinicioDetalles) document.body.classList.remove("floracion-reiniciando");
  }));
}

function mostrarDetalles() {
  if (detallesVisibles) return;
  detallesVisibles = true;
  marcosPolaroid.forEach((marcoFoto) => marcoFoto.classList.add("is-visible"));
  dedicatoria.classList.add("is-visible");
}

function bucle(ahora) {
  if (!iniciado) { marco = 0; return; }
  if (ahora - ultimoRender > 20) {
    ultimoRender = ahora;
    dibujar(ahora);
  }
  if (ahora - inicio < DURACION * 1000) marco = requestAnimationFrame(bucle);
  else {
    dibujar(inicio + DURACION * 1000);
    marco = 0;
  }
}

function florecer() {
  ocultarDetalles();
  iniciado = true;
  inicio = performance.now();
  TODAS_LAS_FLORES.forEach((f) => { f.abrirForzado = null; });
  ultimoRender = 0;
  if (!marco) marco = requestAnimationFrame(bucle);
}

function actualizarMusica() {
  botonMusica.textContent = !musica.paused || !musicaFondo.paused ? "Pausar" : "Música";
}

function recuperarTiempo() {
  const guardado = sessionStorage.getItem("tiempoMusica");
  if (guardado) musica.currentTime = parseFloat(guardado);
}

function alternarMusica() {
  if (!musica.paused || !musicaFondo.paused) {
    musicaFondo.removeEventListener("ended", continuarConCancion);
    musica.pause();
    musicaFondo.pause();
  } else {
    musica.volume = .6;
    musica.play().catch(() => console.warn("El navegador bloqueó la música."));
  }
  actualizarMusica();
}

function continuarConCancion() {
  musica.currentTime = 0;
  musica.volume = .6;
  musica.play().catch(() => console.warn("No se pudo reproducir cancion.mp3."));
}

function iniciarSecuenciaMusical() {
  musicaFondo.removeEventListener("ended", continuarConCancion);
  musica.pause();
  musicaFondo.pause();
  musicaFondo.currentTime = 0;
  musicaFondo.volume = .15;
  musicaFondo.addEventListener("ended", continuarConCancion, { once: true });
  musicaFondo.play().catch(() => console.warn("No se pudo reproducir fondo.mp3."));
}

function resize() {
  prepararLienzo();
}

if (musica.readyState >= 1) recuperarTiempo();
else musica.addEventListener("loadedmetadata", recuperarTiempo, { once: true });
musica.addEventListener("play", actualizarMusica);
musica.addEventListener("pause", actualizarMusica);
musicaFondo.addEventListener("play", actualizarMusica);
musicaFondo.addEventListener("pause", actualizarMusica);
window.addEventListener("beforeunload", () => sessionStorage.setItem("tiempoMusica", musica.currentTime));
window.addEventListener("resize", resize);

botonFlorecer.addEventListener("click", () => { iniciarSecuenciaMusical(); florecer(); });
botonMusica.addEventListener("click", alternarMusica);

formClave.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (inputClave.value.trim().toLowerCase() !== CLAVE_SECRETA.toLowerCase()) {
    errorClave.textContent = "Ups, esa no es la clave secreta 🙈";
    errorClave.hidden = false;
    inputClave.setAttribute("aria-invalid", "true");
    formClave.classList.remove("gatekeeper-tarjeta--error");
    void formClave.offsetWidth;
    formClave.classList.add("gatekeeper-tarjeta--error");
    inputClave.select();
    return;
  }

  errorClave.hidden = true;
  inputClave.removeAttribute("aria-invalid");
  gatekeeper.classList.add("gatekeeper--salir");
  let finalizado = false;
  const finalizarDesbloqueo = () => {
    if (finalizado) return;
    finalizado = true;
    contenidoRegalo.inert = false;
    gatekeeper.hidden = true;
    botonFlorecer.focus({ preventScroll: true });
  };
  gatekeeper.addEventListener("transitionend", (eventoFin) => {
    if (eventoFin.target === gatekeeper && eventoFin.propertyName === "opacity") finalizarDesbloqueo();
  });
  setTimeout(finalizarDesbloqueo, 700);
});

inputClave.addEventListener("input", () => {
  errorClave.hidden = true;
  inputClave.removeAttribute("aria-invalid");
  formClave.classList.remove("gatekeeper-tarjeta--error");
});

prepararLienzo();
actualizarMusica();
requestAnimationFrame(() => inputClave.focus());

