/* =====================================================
   ALMACENAMIENTO
===================================================== */

const CLAVE_JUGADORES = "golfScoreJugadores";

let jugadorEditandoId = null;
let jugadorPendienteEliminarId = null;

/* =====================================================
   ELEMENTOS
===================================================== */

const btnNuevoJugador = document.getElementById("btnNuevoJugador");

const btnPrimerJugador = document.getElementById("btnPrimerJugador");

const buscarJugadorInput = document.getElementById("buscarJugador");

const cantidadJugadores = document.getElementById("cantidadJugadores");

const cantidadJugadoresActivos = document.getElementById(
  "cantidadJugadoresActivos",
);

const handicapPromedio = document.getElementById("handicapPromedio");

const listaJugadoresRegistrados = document.getElementById(
  "listaJugadoresRegistrados",
);

const mensajeSinJugadores = document.getElementById("mensajeSinJugadores");

const modalJugador = document.getElementById("modalJugador");

const tituloModalJugador = document.getElementById("tituloModalJugador");

const formularioJugador = document.getElementById("formularioJugador");

const jugadorIdInput = document.getElementById("jugadorId");

const nombreJugadorInput = document.getElementById("nombreJugador");

const aliasJugadorInput = document.getElementById("aliasJugador");

const correoJugadorInput = document.getElementById("correoJugador");

const telefonoJugadorInput = document.getElementById("telefonoJugador");

const handicapJugadorInput = document.getElementById("handicapJugador");

const categoriaJugadorInput = document.getElementById("categoriaJugador");

const clubJugadorInput = document.getElementById("clubJugador");

const campoJugadorInput = document.getElementById("campoJugador");

const salidaPreferidaJugadorInput = document.getElementById(
  "salidaPreferidaJugador",
);

const jugadorActivoInput = document.getElementById("jugadorActivo");

const mensajeErrorJugador = document.getElementById("mensajeErrorJugador");

const btnCerrarModalJugador = document.getElementById("btnCerrarModalJugador");

const btnCancelarJugador = document.getElementById("btnCancelarJugador");

const modalEliminarJugador = document.getElementById("modalEliminarJugador");

const nombreJugadorEliminar = document.getElementById("nombreJugadorEliminar");

const btnCancelarEliminarJugador = document.getElementById(
  "btnCancelarEliminarJugador",
);

const btnConfirmarEliminarJugador = document.getElementById(
  "btnConfirmarEliminarJugador",
);

const notificacionJugador = document.getElementById("notificacionJugador");

/* =====================================================
   OBTENER Y GUARDAR JUGADORES
===================================================== */

function obtenerJugadores() {
  const datos = localStorage.getItem(CLAVE_JUGADORES);

  if (!datos) {
    return [];
  }

  try {
    const jugadores = JSON.parse(datos);

    return Array.isArray(jugadores) ? jugadores : [];
  } catch (error) {
    console.error("No se pudieron leer los jugadores:", error);

    return [];
  }
}

function guardarJugadores(jugadores) {
  localStorage.setItem(CLAVE_JUGADORES, JSON.stringify(jugadores));
}

/* =====================================================
   OBTENER DATOS RELACIONADOS
===================================================== */

function obtenerClubJugadorPorId(clubId) {
  return obtenerClubes().find((club) => club.id === clubId) || null;
}

function obtenerCampoJugadorPorId(clubId, campoId) {
  const club = obtenerClubJugadorPorId(clubId);

  if (!club || !Array.isArray(club.campos)) {
    return null;
  }

  return club.campos.find((campo) => campo.id === campoId) || null;
}

function obtenerSalidaJugadorPorId(clubId, campoId, salidaId) {
  const campo = obtenerCampoJugadorPorId(clubId, campoId);

  if (!campo || !Array.isArray(campo.salidas)) {
    return null;
  }

  return campo.salidas.find((salida) => salida.id === salidaId) || null;
}

/* =====================================================
   LLENAR SELECT DE CLUBES
===================================================== */

function llenarClubesJugador(clubSeleccionadoId = "") {
  const clubes = obtenerClubes().filter((club) => club.activo !== false);

  clubJugadorInput.innerHTML = `
    <option value="">
      Selecciona un club
    </option>
  `;

  clubes.forEach((club) => {
    const opcion = document.createElement("option");

    opcion.value = club.id;
    opcion.textContent = club.nombre;

    clubJugadorInput.appendChild(opcion);
  });

  clubJugadorInput.value = clubSeleccionadoId;
}

/* =====================================================
   LLENAR CAMPOS
===================================================== */

function llenarCamposJugador(clubId, campoSeleccionadoId = "") {
  campoJugadorInput.innerHTML = `
    <option value="">
      Selecciona un campo
    </option>
  `;

  salidaPreferidaJugadorInput.innerHTML = `
    <option value="">
      Primero selecciona un campo
    </option>
  `;

  salidaPreferidaJugadorInput.disabled = true;

  const club = obtenerClubJugadorPorId(clubId);

  if (!club || !Array.isArray(club.campos) || club.campos.length === 0) {
    campoJugadorInput.innerHTML = `
      <option value="">
        Este club no tiene campos
      </option>
    `;

    campoJugadorInput.disabled = true;
    return;
  }

  const camposActivos = club.campos.filter((campo) => campo.activo !== false);

  if (camposActivos.length === 0) {
    campoJugadorInput.innerHTML = `
      <option value="">
        No hay campos activos
      </option>
    `;

    campoJugadorInput.disabled = true;
    return;
  }

  camposActivos.forEach((campo) => {
    const opcion = document.createElement("option");

    opcion.value = campo.id;
    opcion.textContent = campo.nombre;

    campoJugadorInput.appendChild(opcion);
  });

  campoJugadorInput.disabled = false;
  campoJugadorInput.value = campoSeleccionadoId;
}

/* =====================================================
   LLENAR SALIDAS
===================================================== */

function llenarSalidasJugador(clubId, campoId, salidaSeleccionadaId = "") {
  salidaPreferidaJugadorInput.innerHTML = `
    <option value="">
      Selecciona una salida
    </option>
  `;

  const campo = obtenerCampoJugadorPorId(clubId, campoId);

  if (!campo || !Array.isArray(campo.salidas) || campo.salidas.length === 0) {
    salidaPreferidaJugadorInput.innerHTML = `
      <option value="">
        Este campo no tiene salidas
      </option>
    `;

    salidaPreferidaJugadorInput.disabled = true;
    return;
  }

  const salidasActivas = campo.salidas.filter(
    (salida) => salida.activa !== false,
  );

  if (salidasActivas.length === 0) {
    salidaPreferidaJugadorInput.innerHTML = `
      <option value="">
        No hay salidas activas
      </option>
    `;

    salidaPreferidaJugadorInput.disabled = true;
    return;
  }

  salidasActivas.forEach((salida) => {
    const opcion = document.createElement("option");

    opcion.value = salida.id;
    opcion.textContent = salida.nombre;

    salidaPreferidaJugadorInput.appendChild(opcion);
  });

  salidaPreferidaJugadorInput.disabled = false;

  salidaPreferidaJugadorInput.value = salidaSeleccionadaId;
}

/* =====================================================
   ABRIR MODAL NUEVO
===================================================== */

function abrirModalNuevoJugador() {
  formularioJugador.reset();

  jugadorEditandoId = null;
  jugadorIdInput.value = "";

  tituloModalJugador.textContent = "Registrar jugador";

  jugadorActivoInput.checked = true;

  llenarClubesJugador();

  campoJugadorInput.innerHTML = `
    <option value="">
      Primero selecciona un club
    </option>
  `;

  campoJugadorInput.disabled = true;

  salidaPreferidaJugadorInput.innerHTML = `
    <option value="">
      Primero selecciona un campo
    </option>
  `;

  salidaPreferidaJugadorInput.disabled = true;

  ocultarErrorJugador();

  modalJugador.classList.remove("oculto");

  setTimeout(() => {
    nombreJugadorInput.focus();
  }, 100);
}

/* =====================================================
   ABRIR MODAL EDITAR
===================================================== */

function abrirModalEditarJugador(jugadorId) {
  const jugadores = obtenerJugadores();

  const jugador = jugadores.find(
    (jugadorActual) => jugadorActual.id === jugadorId,
  );

  if (!jugador) {
    mostrarNotificacionJugador("No se encontró el jugador.");

    return;
  }

  jugadorEditandoId = jugador.id;
  jugadorIdInput.value = jugador.id;

  tituloModalJugador.textContent = "Editar jugador";

  nombreJugadorInput.value = jugador.nombre || "";

  aliasJugadorInput.value = jugador.alias || "";

  correoJugadorInput.value = jugador.correo || "";

  telefonoJugadorInput.value = jugador.telefono || "";

  handicapJugadorInput.value = jugador.handicap ?? "";

  categoriaJugadorInput.value = jugador.categoria || "";

  jugadorActivoInput.checked = jugador.activo !== false;

  llenarClubesJugador(jugador.clubId);

  llenarCamposJugador(jugador.clubId, jugador.campoId);

  llenarSalidasJugador(
    jugador.clubId,
    jugador.campoId,
    jugador.salidaPreferidaId,
  );

  ocultarErrorJugador();

  modalJugador.classList.remove("oculto");
}

/* =====================================================
   CERRAR MODAL
===================================================== */

function cerrarModalJugador() {
  modalJugador.classList.add("oculto");

  formularioJugador.reset();

  jugadorEditandoId = null;
  jugadorIdInput.value = "";

  ocultarErrorJugador();
}

/* =====================================================
   VALIDACIÓN
===================================================== */

function mostrarErrorJugador(mensaje) {
  mensajeErrorJugador.textContent = mensaje;

  mensajeErrorJugador.classList.remove("oculto");
}

function ocultarErrorJugador() {
  mensajeErrorJugador.textContent = "";

  mensajeErrorJugador.classList.add("oculto");
}

function validarCorreoJugador(correo) {
  if (!correo) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

/* =====================================================
   GUARDAR JUGADOR
===================================================== */

function guardarFormularioJugador(evento) {
  evento.preventDefault();

  const nombre = nombreJugadorInput.value.trim();

  const alias = aliasJugadorInput.value.trim();

  const correo = correoJugadorInput.value.trim().toLowerCase();

  const telefono = telefonoJugadorInput.value.trim();

  const handicap = Number(handicapJugadorInput.value);

  const categoria = categoriaJugadorInput.value;

  const clubId = clubJugadorInput.value;

  const campoId = campoJugadorInput.value;

  const salidaPreferidaId = salidaPreferidaJugadorInput.value;

  if (!nombre) {
    mostrarErrorJugador("Escribe el nombre completo del jugador.");

    nombreJugadorInput.focus();
    return;
  }

  if (!alias) {
    mostrarErrorJugador("Escribe el alias del jugador.");

    aliasJugadorInput.focus();
    return;
  }

  if (!validarCorreoJugador(correo)) {
    mostrarErrorJugador("Escribe un correo electrónico válido.");

    correoJugadorInput.focus();
    return;
  }

  if (Number.isNaN(handicap) || handicap < -10 || handicap > 54) {
    mostrarErrorJugador("El hándicap debe estar entre -10 y 54.");

    handicapJugadorInput.focus();
    return;
  }

  if (!categoria) {
    mostrarErrorJugador("Selecciona la categoría.");

    categoriaJugadorInput.focus();
    return;
  }

  if (!clubId) {
    mostrarErrorJugador("Selecciona el club de origen.");

    clubJugadorInput.focus();
    return;
  }

  if (!campoId) {
    mostrarErrorJugador("Selecciona el campo habitual.");

    campoJugadorInput.focus();
    return;
  }

  if (!salidaPreferidaId) {
    mostrarErrorJugador("Selecciona la salida preferida.");

    salidaPreferidaJugadorInput.focus();
    return;
  }

  const jugadores = obtenerJugadores();

  const aliasDuplicado = jugadores.some(
    (jugador) =>
      jugador.id !== jugadorEditandoId &&
      jugador.alias?.trim().toLowerCase() === alias.toLowerCase(),
  );

  if (aliasDuplicado) {
    mostrarErrorJugador("Ya existe otro jugador con ese alias.");

    aliasJugadorInput.focus();
    return;
  }

  const correoDuplicado =
    correo &&
    jugadores.some(
      (jugador) =>
        jugador.id !== jugadorEditandoId &&
        jugador.correo?.trim().toLowerCase() === correo,
    );

  if (correoDuplicado) {
    mostrarErrorJugador("Ya existe otro jugador con ese correo.");

    correoJugadorInput.focus();
    return;
  }

  const club = obtenerClubJugadorPorId(clubId);

  const campo = obtenerCampoJugadorPorId(clubId, campoId);

  const salida = obtenerSalidaJugadorPorId(clubId, campoId, salidaPreferidaId);

  if (!club || !campo || !salida) {
    mostrarErrorJugador(
      "La información del club, campo o salida no es válida.",
    );

    return;
  }

  const datosJugador = {
    nombre,
    alias,
    correo,
    telefono,
    handicap,
    categoria,

    clubId,
    clubNombre: club.nombre,

    campoId,
    campoNombre: campo.nombre,

    salidaPreferidaId,
    salidaPreferidaNombre: salida.nombre,

    salidaPreferidaColor: salida.color,

    activo: jugadorActivoInput.checked,

    fechaActualizacion: new Date().toISOString(),
  };

  if (jugadorEditandoId) {
    const indiceJugador = jugadores.findIndex(
      (jugador) => jugador.id === jugadorEditandoId,
    );

    if (indiceJugador === -1) {
      mostrarErrorJugador("No se encontró el jugador.");

      return;
    }

    jugadores[indiceJugador] = {
      ...jugadores[indiceJugador],
      ...datosJugador,
    };

    mostrarNotificacionJugador("Jugador actualizado correctamente.");
  } else {
    jugadores.push({
      id: crearId("jugador"),
      ...datosJugador,
      fechaCreacion: new Date().toISOString(),
    });

    mostrarNotificacionJugador("Jugador registrado correctamente.");
  }

  guardarJugadores(jugadores);

  cerrarModalJugador();

  mostrarJugadores(buscarJugadorInput.value);
}

/* =====================================================
   MOSTRAR JUGADORES
===================================================== */

function mostrarJugadores(filtro = "") {
  const jugadores = obtenerJugadores();

  const textoFiltro = filtro.trim().toLowerCase();

  const jugadoresFiltrados = jugadores.filter((jugador) => {
    const textoJugador = `
        ${jugador.nombre || ""}
        ${jugador.alias || ""}
        ${jugador.clubNombre || ""}
        ${jugador.campoNombre || ""}
        ${jugador.telefono || ""}
        ${jugador.correo || ""}
        ${jugador.categoria || ""}
      `.toLowerCase();

    return textoJugador.includes(textoFiltro);
  });

  cantidadJugadores.textContent = jugadores.length;

  const jugadoresActivos = jugadores.filter(
    (jugador) => jugador.activo !== false,
  );

  cantidadJugadoresActivos.textContent = jugadoresActivos.length;

  const promedio =
    jugadores.length > 0
      ? jugadores.reduce(
          (total, jugador) => total + Number(jugador.handicap || 0),
          0,
        ) / jugadores.length
      : 0;

  handicapPromedio.textContent = promedio.toFixed(1);

  listaJugadoresRegistrados.innerHTML = "";

  if (jugadoresFiltrados.length === 0) {
    mensajeSinJugadores.classList.remove("oculto");

    const titulo = mensajeSinJugadores.querySelector("h2");

    const texto = mensajeSinJugadores.querySelector("p");

    if (jugadores.length > 0 && textoFiltro) {
      titulo.textContent = "No se encontraron jugadores";

      texto.textContent =
        "Prueba buscando otro nombre, alias, club o teléfono.";

      btnPrimerJugador.classList.add("oculto");
    } else {
      titulo.textContent = "No hay jugadores registrados";

      texto.textContent =
        "Registra al primer jugador para poder agregarlo posteriormente a una partida.";

      btnPrimerJugador.classList.remove("oculto");
    }

    return;
  }

  mensajeSinJugadores.classList.add("oculto");

  jugadoresFiltrados.forEach((jugador) => {
    const tarjeta = document.createElement("article");

    tarjeta.className = "tarjetaJugadorRegistrado";

    tarjeta.innerHTML = `
      <div class="encabezadoTarjetaJugador">

        <div class="informacionJugadorRegistrado">

          <div class="avatarJugador">
            ${obtenerInicialesJugador(jugador.nombre)}
          </div>

          <div class="datosJugadorRegistrado">

            <div class="nombreYEstadoJugador">

              <h3>
                ${escaparTextoJugador(jugador.alias)}
              </h3>

              <span class="estadoClub ${
                jugador.activo !== false ? "activo" : "inactivo"
              }">
                ${jugador.activo !== false ? "Activo" : "Inactivo"}
              </span>

            </div>

            <p class="nombreCompletoJugador">
              ${escaparTextoJugador(jugador.nombre)}
            </p>

            <p class="clubJugadorTarjeta">
              ⛳ ${escaparTextoJugador(jugador.clubNombre)}
            </p>

          </div>

        </div>

      </div>


      <div class="resumenTarjetaJugador">

        <div>
          <span>Hándicap</span>

          <strong>
            ${Number(jugador.handicap || 0).toFixed(1)}
          </strong>
        </div>

        <div>
          <span>Categoría</span>

          <strong>
            ${escaparTextoJugador(jugador.categoria)}
          </strong>
        </div>

        <div>
          <span>Salida</span>

          <strong class="salidaJugadorResumen">

            <span
              class="puntoSalidaJugador color-${escaparTextoJugador(
                jugador.salidaPreferidaColor,
              )}"
            ></span>

            ${escaparTextoJugador(jugador.salidaPreferidaNombre)}

          </strong>
        </div>

      </div>


      <div class="detalleJugadorTarjeta">

        <p>
          <span>Campo habitual</span>

          <strong>
            ${escaparTextoJugador(jugador.campoNombre)}
          </strong>
        </p>

        ${
          jugador.telefono
            ? `
              <p>
                <span>Teléfono</span>

                <strong>
                  ${escaparTextoJugador(jugador.telefono)}
                </strong>
              </p>
            `
            : ""
        }

        ${
          jugador.correo
            ? `
              <p>
                <span>Correo</span>

                <strong>
                  ${escaparTextoJugador(jugador.correo)}
                </strong>
              </p>
            `
            : ""
        }

      </div>


      <div class="accionesTarjetaJugador">

        <button
          class="btnEditarClub"
          type="button"
          data-accion="editar"
          data-id="${jugador.id}"
        >
          ✏️ Editar
        </button>

        <button
          class="btnEliminarClub"
          type="button"
          data-accion="eliminar"
          data-id="${jugador.id}"
          aria-label="Eliminar jugador"
        >
          🗑️
        </button>

      </div>
    `;

    listaJugadoresRegistrados.appendChild(tarjeta);
  });
}

/* =====================================================
   INICIALES
===================================================== */

function obtenerInicialesJugador(nombre) {
  const palabras = String(nombre || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (palabras.length === 0) {
    return "JG";
  }

  if (palabras.length === 1) {
    return palabras[0].slice(0, 2).toUpperCase();
  }

  return (palabras[0][0] + palabras[1][0]).toUpperCase();
}

/* =====================================================
   ESCAPAR TEXTO
===================================================== */

function escaparTextoJugador(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =====================================================
   ELIMINAR JUGADOR
===================================================== */

function abrirModalEliminarJugador(jugadorId) {
  const jugadores = obtenerJugadores();

  const jugador = jugadores.find(
    (jugadorActual) => jugadorActual.id === jugadorId,
  );

  if (!jugador) {
    return;
  }

  jugadorPendienteEliminarId = jugadorId;

  nombreJugadorEliminar.textContent = jugador.nombre;

  modalEliminarJugador.classList.remove("oculto");
}

function cerrarModalEliminarJugador() {
  modalEliminarJugador.classList.add("oculto");

  jugadorPendienteEliminarId = null;
}

function confirmarEliminarJugador() {
  if (!jugadorPendienteEliminarId) {
    return;
  }

  const jugadores = obtenerJugadores();

  const jugadoresActualizados = jugadores.filter(
    (jugador) => jugador.id !== jugadorPendienteEliminarId,
  );

  guardarJugadores(jugadoresActualizados);

  cerrarModalEliminarJugador();

  mostrarJugadores(buscarJugadorInput.value);

  mostrarNotificacionJugador("Jugador eliminado correctamente.");
}

/* =====================================================
   NOTIFICACIÓN
===================================================== */

let temporizadorJugador = null;

function mostrarNotificacionJugador(mensaje) {
  notificacionJugador.textContent = mensaje;

  notificacionJugador.classList.remove("oculto");

  clearTimeout(temporizadorJugador);

  temporizadorJugador = setTimeout(() => {
    notificacionJugador.classList.add("oculto");
  }, 2500);
}

/* =====================================================
   EVENTOS
===================================================== */

btnNuevoJugador?.addEventListener("click", abrirModalNuevoJugador);

btnPrimerJugador?.addEventListener("click", abrirModalNuevoJugador);

btnCerrarModalJugador?.addEventListener("click", cerrarModalJugador);

btnCancelarJugador?.addEventListener("click", cerrarModalJugador);

formularioJugador?.addEventListener("submit", guardarFormularioJugador);

buscarJugadorInput?.addEventListener("input", () => {
  mostrarJugadores(buscarJugadorInput.value);
});

clubJugadorInput?.addEventListener("change", () => {
  llenarCamposJugador(clubJugadorInput.value);
});

campoJugadorInput?.addEventListener("change", () => {
  llenarSalidasJugador(clubJugadorInput.value, campoJugadorInput.value);
});

listaJugadoresRegistrados?.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");

  if (!boton) {
    return;
  }

  const jugadorId = boton.dataset.id;
  const accion = boton.dataset.accion;

  if (accion === "editar") {
    abrirModalEditarJugador(jugadorId);
  }

  if (accion === "eliminar") {
    abrirModalEliminarJugador(jugadorId);
  }
});

btnCancelarEliminarJugador?.addEventListener(
  "click",
  cerrarModalEliminarJugador,
);

btnConfirmarEliminarJugador?.addEventListener(
  "click",
  confirmarEliminarJugador,
);

modalJugador?.addEventListener("click", (evento) => {
  if (evento.target === modalJugador) {
    cerrarModalJugador();
  }
});

modalEliminarJugador?.addEventListener("click", (evento) => {
  if (evento.target === modalEliminarJugador) {
    cerrarModalEliminarJugador();
  }
});

/* =====================================================
   INICIAR
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  mostrarJugadores();
});
