/* =====================================================
   CLAVES DE ALMACENAMIENTO
===================================================== */

const CLAVE_PARTIDAS = "golfScorePartidas";
const CLAVE_PARTIDA_ACTUAL = "golfScorePartidaActual";

/* =====================================================
   ESTADO DEL MARCADOR
===================================================== */

let partidaActual = null;
let indiceHoyoActual = 0;
let indiceJugadorActivo = 0;
let numeroCapturadoTemporal = "";

/* =====================================================
   ELEMENTOS
===================================================== */

const nombreClubMarcador = document.getElementById("nombreClubMarcador");

const tituloMarcador = document.getElementById("tituloMarcador");

const numeroHoyoElemento = document.getElementById("numeroHoyo");

const totalHoyosElemento = document.getElementById("totalHoyos");

const parHoyoElemento = document.getElementById("parHoyo");

const ventajaHoyoElemento = document.getElementById("ventajaHoyo");

const salidaHoyoElemento = document.getElementById("salidaHoyo");

const distanciaHoyoElemento = document.getElementById("distanciaHoyo");

const listaHoyosElemento = document.getElementById("listaHoyos");

const listaJugadoresElemento = document.getElementById("listaJugadores");

const nombreJugadorActivo = document.getElementById("nombreJugadorActivo");

const numeroCapturado = document.getElementById("numeroCapturado");

const btnHoyoAnterior = document.getElementById("btnHoyoAnterior");

const btnHoyoSiguiente = document.getElementById("btnHoyoSiguiente");

const btnBorrar = document.getElementById("btnBorrar");

const btnConfirmar = document.getElementById("btnConfirmar");

const btnGuardarPartida = document.getElementById("btnGuardarPartida");

const modalGuardado = document.getElementById("modalGuardado");

const btnCerrarModal = document.getElementById("btnCerrarModal");

const btnFinalizarPartida = document.getElementById("btnFinalizarPartida");

btnFinalizarPartida?.addEventListener("click", finalizarPartida);

/* =====================================================
   LEER Y GUARDAR PARTIDAS
===================================================== */

function obtenerPartidas() {
  const datos = localStorage.getItem(CLAVE_PARTIDAS);

  if (!datos) {
    return [];
  }

  try {
    const partidas = JSON.parse(datos);

    return Array.isArray(partidas) ? partidas : [];
  } catch (error) {
    console.error("No se pudieron leer las partidas:", error);

    return [];
  }
}

function guardarPartidas(partidas) {
  localStorage.setItem(CLAVE_PARTIDAS, JSON.stringify(partidas));
}

/* =====================================================
   CARGAR PARTIDA ACTIVA
===================================================== */

function cargarPartidaActual() {
  const partidaId = localStorage.getItem(CLAVE_PARTIDA_ACTUAL);

  const partidas = obtenerPartidas();

  partidaActual = partidas.find((partida) => partida.id === partidaId) || null;

  if (!partidaActual) {
    mostrarSinPartida();
    return false;
  }

  asegurarEstructuraPartida();

  indiceHoyoActual = 0;
  indiceJugadorActivo = 0;

  actualizarMarcadorCompleto();

  return true;
}

/* =====================================================
   ASEGURAR ESTRUCTURA
===================================================== */

function asegurarEstructuraPartida() {
  if (!Array.isArray(partidaActual.jugadores)) {
    partidaActual.jugadores = [];
  }

  if (!Array.isArray(partidaActual.hoyos)) {
    partidaActual.hoyos = [];
  }

  partidaActual.jugadores.forEach((jugador) => {
    if (!jugador.scores || typeof jugador.scores !== "object") {
      jugador.scores = {};
    }
  });
}

/* =====================================================
   SIN PARTIDA
===================================================== */

function mostrarSinPartida() {
  nombreClubMarcador.textContent = "Sin partida activa";

  tituloMarcador.textContent = "⛳ Golf Score";

  numeroHoyoElemento.textContent = "-";
  totalHoyosElemento.textContent = "de 0";

  parHoyoElemento.textContent = "-";
  ventajaHoyoElemento.textContent = "-";
  salidaHoyoElemento.textContent = "-";
  distanciaHoyoElemento.textContent = "-";

  listaHoyosElemento.innerHTML = "";

  listaJugadoresElemento.innerHTML = `
    <div class="mensajeSinPartidaMarcador">
      <div>⛳</div>

      <h2>No hay una partida activa</h2>

      <p>
        Crea una nueva partida para comenzar a capturar
        los resultados.
      </p>

      <a
        href="partida.html"
        class="btnIrNuevaPartida"
      >
        Crear nueva partida
      </a>
    </div>
  `;

  nombreJugadorActivo.textContent = "-";
  numeroCapturado.textContent = "-";
}

/* =====================================================
   ACTUALIZAR TODO
===================================================== */

function actualizarMarcadorCompleto() {
  if (!partidaActual) {
    return;
  }

  nombreClubMarcador.textContent = `${partidaActual.clubNombre} · ${partidaActual.campoNombre}`;

  tituloMarcador.textContent = partidaActual.nombre || "⛳ Golf Score";

  crearBotonesHoyosMarcador();
  mostrarHoyoActual();
  mostrarJugadoresMarcador();
  actualizarJugadorActivo();
  actualizarBotonesNavegacion();
}

/* =====================================================
   HOYO ACTUAL
===================================================== */

function obtenerHoyoActual() {
  if (!partidaActual) {
    return null;
  }

  return partidaActual.hoyos[indiceHoyoActual] || null;
}

function mostrarHoyoActual() {
  const hoyo = obtenerHoyoActual();

  if (!hoyo) {
    return;
  }

  numeroHoyoElemento.textContent = hoyo.numero;

  totalHoyosElemento.textContent = `de ${partidaActual.hoyos.length}`;

  parHoyoElemento.textContent = hoyo.par || "-";

  const jugador = partidaActual.jugadores[indiceJugadorActivo];

  const datosSalida = jugador ? hoyo.salidas?.[jugador.salidaId] : null;

  ventajaHoyoElemento.textContent = datosSalida?.ventaja ?? "-";

  salidaHoyoElemento.textContent = jugador?.salidaNombre || "-";

  distanciaHoyoElemento.textContent = datosSalida?.distancia ?? "-";
}

/* =====================================================
   BOTONES DE HOYOS
===================================================== */

function crearBotonesHoyosMarcador() {
  listaHoyosElemento.innerHTML = "";

  partidaActual.hoyos.forEach((hoyo, indice) => {
    const boton = document.createElement("button");

    boton.type = "button";
    boton.className = "botonHoyo";
    boton.textContent = hoyo.numero;
    boton.dataset.indice = indice;

    if (indice === indiceHoyoActual) {
      boton.classList.add("hoyoActual");
    }

    if (hoyoCompleto(indice)) {
      boton.classList.add("hoyoCapturado");
    }

    boton.addEventListener("click", () => {
      indiceHoyoActual = indice;
      numeroCapturadoTemporal = "";

      actualizarMarcadorCompleto();
    });

    listaHoyosElemento.appendChild(boton);
  });
}

function hoyoCompleto(indiceHoyo) {
  return partidaActual.jugadores.every((jugador) => {
    const hoyo = partidaActual.hoyos[indiceHoyo];

    return Number(jugador.scores?.[hoyo.numero]) > 0;
  });
}

/* =====================================================
   MOSTRAR JUGADORES
===================================================== */

function mostrarJugadoresMarcador() {
  listaJugadoresElemento.innerHTML = "";

  partidaActual.jugadores.forEach((jugador, indice) => {
    const hoyo = obtenerHoyoActual();

    const scoreHoyo = jugador.scores?.[hoyo.numero];

    const ida = calcularTotalJugador(jugador, 1, 9);

    const vuelta = calcularTotalJugador(jugador, 10, 18);

    const total = ida + vuelta;

    const fila = document.createElement("button");

    fila.type = "button";

    fila.className =
      indice === indiceJugadorActivo
        ? "filaJugador jugadorSeleccionado"
        : "filaJugador";

    fila.innerHTML = `
        <span class="datosJugador">

          <span
            class="colorSalida color-${escaparHTML(jugador.salidaColor)}"
          ></span>

          <span class="nombreJugador">
            ${escaparHTML(jugador.alias)}
          </span>

        </span>

        <strong class="golpeHoyo">
          ${scoreHoyo || "-"}
        </strong>

        <span>${ida}</span>

        <span>${vuelta}</span>

        <strong>${total}</strong>
      `;

    fila.addEventListener("click", () => {
      indiceJugadorActivo = indice;
      numeroCapturadoTemporal = "";

      actualizarMarcadorCompleto();
    });

    listaJugadoresElemento.appendChild(fila);
  });
}

/* =====================================================
   TOTALES
===================================================== */

function calcularTotalJugador(jugador, desde, hasta) {
  return partidaActual.hoyos.reduce((total, hoyo) => {
    const numero = Number(hoyo.numero);

    if (numero < desde || numero > hasta) {
      return total;
    }

    return total + Number(jugador.scores?.[hoyo.numero] || 0);
  }, 0);
}

/* =====================================================
   JUGADOR ACTIVO
===================================================== */

function actualizarJugadorActivo() {
  const jugador = partidaActual.jugadores[indiceJugadorActivo];

  nombreJugadorActivo.textContent = jugador?.alias || "-";

  numeroCapturado.textContent = numeroCapturadoTemporal || "-";

  mostrarHoyoActual();
}

/* =====================================================
   TECLADO
===================================================== */

document.querySelectorAll(".tecla[data-numero]").forEach((tecla) => {
  tecla.addEventListener("click", () => {
    if (!partidaActual) {
      return;
    }

    const numero = tecla.dataset.numero;

    if (numeroCapturadoTemporal.length >= 2) {
      return;
    }

    numeroCapturadoTemporal += numero;

    numeroCapturado.textContent = numeroCapturadoTemporal;
  });
});

btnBorrar?.addEventListener("click", () => {
  numeroCapturadoTemporal = numeroCapturadoTemporal.slice(0, -1);

  numeroCapturado.textContent = numeroCapturadoTemporal || "-";
});

btnConfirmar?.addEventListener("click", () => {
  if (!partidaActual) {
    return;
  }

  const score = Number(numeroCapturadoTemporal);

  if (!score || score < 1 || score > 30) {
    alert("Captura un número de golpes válido.");

    return;
  }

  const jugador = partidaActual.jugadores[indiceJugadorActivo];

  const hoyo = obtenerHoyoActual();

  jugador.scores[hoyo.numero] = score;

  numeroCapturadoTemporal = "";

  guardarCambiosPartida();

  avanzarJugadorOHoyo();
});

/* =====================================================
   AVANCE AUTOMÁTICO
===================================================== */

function avanzarJugadorOHoyo() {
  if (indiceJugadorActivo < partidaActual.jugadores.length - 1) {
    indiceJugadorActivo++;
  } else {
    indiceJugadorActivo = 0;

    if (indiceHoyoActual < partidaActual.hoyos.length - 1) {
      indiceHoyoActual++;
    }
  }

  actualizarMarcadorCompleto();
}

/* =====================================================
   CAMBIAR HOYO
===================================================== */

btnHoyoAnterior?.addEventListener("click", () => {
  if (!partidaActual || indiceHoyoActual <= 0) {
    return;
  }

  indiceHoyoActual--;
  numeroCapturadoTemporal = "";

  actualizarMarcadorCompleto();
});

btnHoyoSiguiente?.addEventListener("click", () => {
  if (!partidaActual || indiceHoyoActual >= partidaActual.hoyos.length - 1) {
    return;
  }

  indiceHoyoActual++;
  numeroCapturadoTemporal = "";

  actualizarMarcadorCompleto();
});

function actualizarBotonesNavegacion() {
  btnHoyoAnterior.disabled = indiceHoyoActual <= 0;

  btnHoyoSiguiente.disabled =
    indiceHoyoActual >= partidaActual.hoyos.length - 1;
}

/* =====================================================
   GUARDAR CAMBIOS
===================================================== */

function guardarCambiosPartida() {
  const partidas = obtenerPartidas();

  const indice = partidas.findIndex(
    (partida) => partida.id === partidaActual.id,
  );

  if (indice === -1) {
    return;
  }

  partidaActual.fechaActualizacion = new Date().toISOString();

  partidas[indice] = partidaActual;

  guardarPartidas(partidas);
}

/* =====================================================
   BOTÓN GUARDAR PARTIDA
===================================================== */

btnGuardarPartida?.addEventListener("click", () => {
  if (!partidaActual) {
    return;
  }

  guardarCambiosPartida();

  modalGuardado.classList.remove("oculto");
});

btnCerrarModal?.addEventListener("click", () => {
  modalGuardado.classList.add("oculto");
});

/* =====================================================
   ESCAPAR TEXTO
===================================================== */

function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =====================================================
   MENÚ DESPLEGABLE
===================================================== */

const btnMenu = document.getElementById("btnMenu");
const btnCerrarMenu = document.getElementById("btnCerrarMenu");

const menuDesplegable = document.getElementById("menuDesplegable");

const fondoMenu = document.getElementById("fondoMenu");

function abrirMenu() {
  fondoMenu?.classList.remove("oculto");
  menuDesplegable?.classList.add("menuVisible");

  document.body.classList.add("menuAbierto");
}

function cerrarMenu() {
  menuDesplegable?.classList.remove("menuVisible");

  document.body.classList.remove("menuAbierto");

  setTimeout(() => {
    fondoMenu?.classList.add("oculto");
  }, 280);
}

btnMenu?.addEventListener("click", abrirMenu);
btnCerrarMenu?.addEventListener("click", cerrarMenu);

fondoMenu?.addEventListener("click", cerrarMenu);

/* =====================================================
   INICIAR
===================================================== */

document.addEventListener("DOMContentLoaded", cargarPartidaActual);

function finalizarPartida() {
  const partidas = JSON.parse(localStorage.getItem("golfScorePartidas")) || [];

  const partidaActualId = localStorage.getItem("golfScorePartidaActual");

  const partida = partidas.find(
    (partidaItem) => partidaItem.id === partidaActualId,
  );

  if (!partida) {
    alert("No se encontró la partida actual.");
    return;
  }

  const jugadores = Array.isArray(partida.jugadores) ? partida.jugadores : [];

  const hoyos = Array.isArray(partida.hoyos) ? partida.hoyos : [];

  const faltanScores = jugadores.some((jugador) => {
    const scores =
      jugador.scores && typeof jugador.scores === "object"
        ? jugador.scores
        : {};

    return hoyos.some((hoyo) => {
      return !Number(scores[hoyo.numero]);
    });
  });

  if (faltanScores) {
    alert(
      "Todavía faltan scores por capturar. Completa todos los hoyos antes de finalizar.",
    );
    return;
  }

  const confirmar = confirm(
    "¿Deseas finalizar la partida? Después aparecerá como terminada.",
  );

  if (!confirmar) {
    return;
  }

  partida.estado = "finalizada";
  partida.fechaFinalizacion = new Date().toISOString();

  localStorage.setItem("golfScorePartidas", JSON.stringify(partidas));

  alert("Partida finalizada correctamente.");

  window.location.href = "partidas.html";
}
