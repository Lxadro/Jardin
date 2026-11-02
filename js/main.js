/* ==========================================================
   js/main.js - Lógica de la página de bienvenida (index.html)
   ========================================================== */

// 📝 PERSONALIZABLE: cuántos corazones flotan en el fondo
const CANTIDAD_CORAZONES = 18;

// 📝 PERSONALIZABLE: emojis que pueden aparecer como corazones
const EMOJIS_CORAZON = ["💖", "💕", "🌹", "💗", "🤍"];

// Clave para recordar en qué segundo iba la canción al cambiar de página
const CLAVE_TIEMPO_MUSICA = "tiempoMusica";

/* ----------------------------------------------------------
   1. Corazones flotantes de fondo
   ---------------------------------------------------------- */
function crearCorazones() {
  const contenedor = document.getElementById("hearts");
  if (!contenedor) return;

  // Si la persona prefiere menos movimiento, no creamos los corazones
  const prefiereMenosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefiereMenosMovimiento) return;

  for (let i = 0; i < CANTIDAD_CORAZONES; i++) {
    const corazon = document.createElement("span");
    corazon.classList.add("heart");
    corazon.textContent =
      EMOJIS_CORAZON[Math.floor(Math.random() * EMOJIS_CORAZON.length)];

    // Posición horizontal aleatoria (0% a 100%)
    corazon.style.left = Math.random() * 100 + "%";

    // Tamaño aleatorio entre 0.8 y 1.8 veces el tamaño base
    corazon.style.fontSize = 0.8 + Math.random() * 1 + "rem";

    // Duración aleatoria entre 6 y 12 segundos (más pequeño = más rápido)
    corazon.style.animationDuration = 6 + Math.random() * 6 + "s";

    // Retraso aleatorio para que no aparezcan todos a la vez
    corazon.style.animationDelay = Math.random() * 8 + "s";

    contenedor.appendChild(corazon);
  }
}

/* ----------------------------------------------------------
   2. Música de fondo
   ---------------------------------------------------------- */
const musica = document.getElementById("bg-music");

// Recupera el tiempo guardado si venimos de otra página del proyecto
function recuperarTiempoMusica() {
  const guardado = sessionStorage.getItem(CLAVE_TIEMPO_MUSICA);
  if (musica && guardado) {
    musica.currentTime = parseFloat(guardado);
  }
}

// Guarda el tiempo actual para continuar en la siguiente página
function guardarTiempoMusica() {
  if (musica) {
    sessionStorage.setItem(CLAVE_TIEMPO_MUSICA, musica.currentTime);
  }
}

// Intenta reproducir la música. Los navegadores solo lo permiten
// después de un clic del usuario, por eso se llama desde el botón.
function reproducirMusica() {
  if (!musica) return;
  musica.volume = 0.6; // 📝 PERSONALIZABLE: volumen de 0 a 1
  const promesa = musica.play();
  if (promesa !== undefined) {
    promesa.catch(() => {
      // Si el archivo no existe o el navegador bloquea el audio,
      // la página sigue funcionando sin música
      console.warn("No se pudo reproducir la música de fondo.");
    });
  }
}

/* ----------------------------------------------------------
   3. Botón de inicio: música + transición a la siguiente página
   ---------------------------------------------------------- */
function configurarBotonInicio() {
  const boton = document.getElementById("open-btn");
  if (!boton) return;

  boton.addEventListener("click", (evento) => {
    evento.preventDefault(); // Evitamos que el enlace cambie de página de inmediato

    reproducirMusica();
    guardarTiempoMusica();

    // Pequeña pausa para que se vea la animación antes de cambiar de página.
    // Usamos el href del botón, así funciona sin importar cómo se llame la página.
    const destino = boton.getAttribute("href");
    document.body.classList.add("saliendo");
    setTimeout(() => {
      window.location.href = destino;
    }, 600);
  });
}

// Guardamos el tiempo también si la persona cierra o recarga la página
window.addEventListener("beforeunload", guardarTiempoMusica);

/* ----------------------------------------------------------
   Arranque: se ejecuta cuando la página termina de cargar
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  crearCorazones();
  recuperarTiempoMusica();
  configurarBotonInicio();
});