/* =====================================================
   CLAVES DE ALMACENAMIENTO
===================================================== */

const CLAVE_CLUB_ACTUAL = "golfScoreClubSeleccionado";

const CLAVE_CAMPO_ACTUAL = "golfScoreCampoSeleccionado";

/* =====================================================
   DATOS ACTUALES
===================================================== */

const clubActualId = localStorage.getItem(CLAVE_CLUB_ACTUAL);

const campoActualId = localStorage.getItem(CLAVE_CAMPO_ACTUAL);

let salidaEditandoId = null;
let salidaPendienteEliminarId = null;

/* =====================================================
   ELEMENTOS
===================================================== */

const nombreCampoSalidas = document.getElementById("nombreCampoSalidas");

const nombreClubSalidas = document.getElementById("nombreClubSalidas");

const campoSeleccionadoSalidas = document.getElementById(
  "campoSeleccionadoSalidas",
);

const listaSalidas = document.getElementById("listaSalidas");

const mensajeSinSalidas = document.getElementById("mensajeSinSalidas");

const btnNuevaSalida = document.getElementById("btnNuevaSalida");

const btnPrimeraSalida = document.getElementById("btnPrimeraSalida");

const modalSalida = document.getElementById("modalSalida");

const formularioSalida = document.getElementById("formularioSalida");

const salidaIdInput = document.getElementById("salidaId");

const nombreSalidaInput = document.getElementById("nombreSalida");

const colorSalidaInput = document.getElementById("colorSalida");

const ratingSalidaInput = document.getElementById("ratingSalida");

const slopeSalidaInput = document.getElementById("slopeSalida");

const yardajeTotalSalidaInput = document.getElementById("yardajeTotalSalida");

const salidaActivaInput = document.getElementById("salidaActiva");

const tituloModalSalida = document.getElementById("tituloModalSalida");

const mensajeErrorSalida = document.getElementById("mensajeErrorSalida");

const btnCerrarModalSalida = document.getElementById("btnCerrarModalSalida");

const btnCancelarSalida = document.getElementById("btnCancelarSalida");

const modalEliminarSalida = document.getElementById("modalEliminarSalida");

const nombreSalidaEliminar = document.getElementById("nombreSalidaEliminar");

const btnCancelarEliminarSalida = document.getElementById(
  "btnCancelarEliminarSalida",
);

const btnConfirmarEliminarSalida = document.getElementById(
  "btnConfirmarEliminarSalida",
);

const notificacionSalida = document.getElementById("notificacionSalida");

/* =====================================================
   OBTENER CLUB Y CAMPO
===================================================== */

function obtenerClubYCampoActuales() {
  const clubes = obtenerClubes();

  const club = clubes.find((clubActual) => clubActual.id === clubActualId);

  if (!club) {
    return {
      clubes,
      club: null,
      campo: null,
    };
  }

  const campo = Array.isArray(club.campos)
    ? club.campos.find((campoActual) => campoActual.id === campoActualId)
    : null;

  return {
    clubes,
    club,
    campo,
  };
}

/* =====================================================
   MOSTRAR INFORMACIÓN
===================================================== */

function mostrarInformacionCampoSalidas() {
  const { club, campo } = obtenerClubYCampoActuales();

  if (!club || !campo) {
    window.location.href = "administrar-club.html";

    return;
  }

  nombreCampoSalidas.textContent = `🚩 ${campo.nombre}`;

  nombreClubSalidas.textContent = club.nombre;

  campoSeleccionadoSalidas.textContent = campo.nombre;
}

/* =====================================================
   MOSTRAR SALIDAS
===================================================== */

function mostrarSalidas() {
  const { campo } = obtenerClubYCampoActuales();

  if (!campo) {
    return;
  }

  if (!Array.isArray(campo.salidas)) {
    campo.salidas = [];
  }

  listaSalidas.innerHTML = "";

  if (campo.salidas.length === 0) {
    mensajeSinSalidas.classList.remove("oculto");

    return;
  }

  mensajeSinSalidas.classList.add("oculto");

  campo.salidas.forEach((salida) => {
    const tarjeta = document.createElement("article");

    tarjeta.className = "tarjetaSalida";

    tarjeta.innerHTML = `
      <div class="encabezadoTarjetaSalida">

        <div class="informacionSalida">

          <span
            class="muestraColorSalida color-${escaparHTML(salida.color)}"
          ></span>

          <div>
            <h3>
              ${escaparHTML(salida.nombre)}
            </h3>

            <p>
              ${escaparHTML(salida.color || "")}
            </p>
          </div>

        </div>

        <span class="estadoClub ${
          salida.activa !== false ? "activo" : "inactivo"
        }">
          ${salida.activa !== false ? "Activa" : "Inactiva"}
        </span>

      </div>

      <div class="resumenTarjetaSalida">

        <div>
          <span>Rating</span>
          <strong>
            ${Number(salida.rating || 0).toFixed(1)}
          </strong>
        </div>

        <div>
          <span>Slope</span>
          <strong>
            ${salida.slope || 0}
          </strong>
        </div>

        <div>
          <span>Yardaje</span>
          <strong>
            ${salida.yardajeTotal || 0}
          </strong>
        </div>

      </div>

      <div class="accionesTarjetaSalida">

        <button
          class="btnEditarClub"
          type="button"
          data-accion="editar"
          data-id="${salida.id}"
        >
          ✏️ Editar
        </button>

        <button
          class="btnEliminarClub"
          type="button"
          data-accion="eliminar"
          data-id="${salida.id}"
        >
          🗑️
        </button>

      </div>
    `;

    listaSalidas.appendChild(tarjeta);
  });
}

/* =====================================================
   MODAL NUEVA SALIDA
===================================================== */

function abrirModalNuevaSalida() {
  formularioSalida.reset();

  salidaEditandoId = null;
  salidaIdInput.value = "";

  salidaActivaInput.checked = true;

  tituloModalSalida.textContent = "Registrar salida";

  ocultarErrorSalida();

  modalSalida.classList.remove("oculto");

  setTimeout(() => {
    nombreSalidaInput.focus();
  }, 100);
}

function abrirModalEditarSalida(salidaId) {
  const { campo } = obtenerClubYCampoActuales();

  if (!campo) {
    return;
  }

  const salida = campo.salidas.find(
    (salidaActual) => salidaActual.id === salidaId,
  );

  if (!salida) {
    mostrarNotificacionSalida("No se encontró la salida.");

    return;
  }

  salidaEditandoId = salidaId;
  salidaIdInput.value = salidaId;

  nombreSalidaInput.value = salida.nombre || "";

  colorSalidaInput.value = salida.color || "";

  ratingSalidaInput.value = salida.rating ?? "";

  slopeSalidaInput.value = salida.slope ?? "";

  yardajeTotalSalidaInput.value = salida.yardajeTotal ?? "";

  salidaActivaInput.checked = salida.activa !== false;

  tituloModalSalida.textContent = "Editar salida";

  ocultarErrorSalida();

  modalSalida.classList.remove("oculto");
}

function cerrarModalSalida() {
  modalSalida.classList.add("oculto");

  formularioSalida.reset();

  salidaEditandoId = null;
  salidaIdInput.value = "";

  ocultarErrorSalida();
}

/* =====================================================
   VALIDACIÓN
===================================================== */

function mostrarErrorSalida(mensaje) {
  mensajeErrorSalida.textContent = mensaje;

  mensajeErrorSalida.classList.remove("oculto");
}

function ocultarErrorSalida() {
  mensajeErrorSalida.textContent = "";

  mensajeErrorSalida.classList.add("oculto");
}

/* =====================================================
   GUARDAR SALIDA
===================================================== */

function guardarSalida(evento) {
  evento.preventDefault();

  const nombre = nombreSalidaInput.value.trim();

  const color = colorSalidaInput.value;

  const rating = Number(ratingSalidaInput.value);

  const slope = Number(slopeSalidaInput.value);

  const yardajeTotal = Number(yardajeTotalSalidaInput.value || 0);

  if (!nombre) {
    mostrarErrorSalida("Escribe el nombre de la salida.");

    nombreSalidaInput.focus();
    return;
  }

  if (!color) {
    mostrarErrorSalida("Selecciona el color de la salida.");

    colorSalidaInput.focus();
    return;
  }

  if (!rating || rating < 50 || rating > 90) {
    mostrarErrorSalida("Escribe un Course Rating válido.");

    ratingSalidaInput.focus();
    return;
  }

  if (!slope || slope < 55 || slope > 155) {
    mostrarErrorSalida("Escribe un Slope Rating válido.");

    slopeSalidaInput.focus();
    return;
  }

  const { clubes, club, campo } = obtenerClubYCampoActuales();

  if (!club || !campo) {
    mostrarErrorSalida("No se encontró el campo.");

    return;
  }

  if (!Array.isArray(campo.salidas)) {
    campo.salidas = [];
  }

  const datosSalida = {
    nombre,
    color,
    rating,
    slope,
    yardajeTotal,
    activa: salidaActivaInput.checked,
  };

  if (salidaEditandoId) {
    const salida = campo.salidas.find(
      (salidaActual) => salidaActual.id === salidaEditandoId,
    );

    if (!salida) {
      mostrarErrorSalida("No se encontró la salida.");

      return;
    }

    Object.assign(salida, {
      ...datosSalida,
      fechaActualizacion: new Date().toISOString(),
    });

    mostrarNotificacionSalida("Salida actualizada correctamente.");
  } else {
    const salidaDuplicada = campo.salidas.some(
      (salida) => salida.nombre.trim().toLowerCase() === nombre.toLowerCase(),
    );

    if (salidaDuplicada) {
      mostrarErrorSalida("Ya existe una salida con ese nombre.");

      return;
    }

    campo.salidas.push({
      id: crearId("salida"),
      ...datosSalida,
      fechaCreacion: new Date().toISOString(),
    });

    mostrarNotificacionSalida("Salida registrada correctamente.");
  }

  guardarClubes(clubes);

  cerrarModalSalida();
  mostrarSalidas();
}

/* =====================================================
   ELIMINAR SALIDA
===================================================== */

function abrirEliminarSalida(salidaId) {
  const { campo } = obtenerClubYCampoActuales();

  if (!campo) {
    return;
  }

  const salida = campo.salidas.find(
    (salidaActual) => salidaActual.id === salidaId,
  );

  if (!salida) {
    return;
  }

  salidaPendienteEliminarId = salidaId;

  nombreSalidaEliminar.textContent = salida.nombre;

  modalEliminarSalida.classList.remove("oculto");
}

function cerrarEliminarSalida() {
  modalEliminarSalida.classList.add("oculto");

  salidaPendienteEliminarId = null;
}

function confirmarEliminarSalida() {
  if (!salidaPendienteEliminarId) {
    return;
  }

  const { clubes, campo } = obtenerClubYCampoActuales();

  if (!campo) {
    return;
  }

  campo.salidas = campo.salidas.filter(
    (salida) => salida.id !== salidaPendienteEliminarId,
  );

  guardarClubes(clubes);

  cerrarEliminarSalida();
  mostrarSalidas();

  mostrarNotificacionSalida("Salida eliminada correctamente.");
}

/* =====================================================
   NOTIFICACIÓN
===================================================== */

let temporizadorSalida = null;

function mostrarNotificacionSalida(mensaje) {
  notificacionSalida.textContent = mensaje;

  notificacionSalida.classList.remove("oculto");

  clearTimeout(temporizadorSalida);

  temporizadorSalida = setTimeout(() => {
    notificacionSalida.classList.add("oculto");
  }, 2500);
}

/* =====================================================
   EVENTOS
===================================================== */

btnNuevaSalida?.addEventListener("click", abrirModalNuevaSalida);

btnPrimeraSalida?.addEventListener("click", abrirModalNuevaSalida);

btnCerrarModalSalida?.addEventListener("click", cerrarModalSalida);

btnCancelarSalida?.addEventListener("click", cerrarModalSalida);

formularioSalida?.addEventListener("submit", guardarSalida);

listaSalidas?.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");

  if (!boton) {
    return;
  }

  const salidaId = boton.dataset.id;
  const accion = boton.dataset.accion;

  if (accion === "editar") {
    abrirModalEditarSalida(salidaId);
  }

  if (accion === "eliminar") {
    abrirEliminarSalida(salidaId);
  }
});

btnCancelarEliminarSalida?.addEventListener("click", cerrarEliminarSalida);

btnConfirmarEliminarSalida?.addEventListener("click", confirmarEliminarSalida);

modalSalida?.addEventListener("click", (evento) => {
  if (evento.target === modalSalida) {
    cerrarModalSalida();
  }
});

modalEliminarSalida?.addEventListener("click", (evento) => {
  if (evento.target === modalEliminarSalida) {
    cerrarEliminarSalida();
  }
});

/* =====================================================
   INICIO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  mostrarInformacionCampoSalidas();
  mostrarSalidas();
});
