const CLAVE_CLUBES = "golfScoreClubes";

function obtenerClubes() {
  const datosGuardados = localStorage.getItem(CLAVE_CLUBES);

  if (!datosGuardados) {
    return [];
  }

  try {
    return JSON.parse(datosGuardados);
  } catch (error) {
    console.error("No se pudieron leer los clubes:", error);
    return [];
  }
}

function guardarClubes(clubes) {
  localStorage.setItem(CLAVE_CLUBES, JSON.stringify(clubes));
}

function crearId(prefijo = "registro") {
  return `${prefijo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function registrarClub(datosClub) {
  const clubes = obtenerClubes();

  const nuevoClub = {
    id: crearId("club"),
    nombre: datosClub.nombre.trim(),
    ciudad: datosClub.ciudad.trim(),
    estado: datosClub.estado.trim(),
    activo: true,
    campos: [],
    fechaCreacion: new Date().toISOString(),
  };

  clubes.push(nuevoClub);
  guardarClubes(clubes);

  return nuevoClub;
}

function agregarCampoAClub(clubId, datosCampo) {
  const clubes = obtenerClubes();

  const club = clubes.find((clubActual) => clubActual.id === clubId);

  if (!club) {
    throw new Error("No se encontró el club.");
  }

  const nuevoCampo = {
    id: crearId("campo"),
    nombre: datosCampo.nombre.trim(),
    totalHoyos: Number(datosCampo.totalHoyos),
    parTotal: 0,
    activo: true,
    salidas: [],
    hoyos: [],
  };

  club.campos.push(nuevoCampo);
  guardarClubes(clubes);

  return nuevoCampo;
}

function agregarCampoAClub(clubId, datosCampo) {
  const clubes = obtenerClubes();

  const club = clubes.find((clubActual) => clubActual.id === clubId);

  if (!club) {
    throw new Error("No se encontró el club.");
  }

  const nuevoCampo = {
    id: crearId("campo"),
    nombre: datosCampo.nombre.trim(),
    totalHoyos: Number(datosCampo.totalHoyos),
    parTotal: 0,
    activo: true,
    salidas: [],
    hoyos: [],
  };

  club.campos.push(nuevoCampo);
  guardarClubes(clubes);

  return nuevoCampo;
}

function agregarSalidaACampo(clubId, campoId, datosSalida) {
  const clubes = obtenerClubes();

  const club = clubes.find((clubActual) => clubActual.id === clubId);

  if (!club) {
    throw new Error("No se encontró el club.");
  }

  const campo = club.campos.find((campoActual) => campoActual.id === campoId);

  if (!campo) {
    throw new Error("No se encontró el campo.");
  }

  const nuevaSalida = {
    id: crearId("salida"),
    nombre: datosSalida.nombre.trim(),
    color: datosSalida.color,
    rating: Number(datosSalida.rating),
    slope: Number(datosSalida.slope),
  };

  campo.salidas.push(nuevaSalida);
  guardarClubes(clubes);

  return nuevaSalida;
}

/* =====================================================
   ELEMENTOS DE LA PÁGINA
===================================================== */

const btnNuevoClub = document.getElementById("btnNuevoClub");
const btnPrimerClub = document.getElementById("btnPrimerClub");

const modalClub = document.getElementById("modalClub");
const btnCerrarModalClub = document.getElementById("btnCerrarModalClub");
const btnCancelarClub = document.getElementById("btnCancelarClub");

const formularioClub = document.getElementById("formularioClub");

const clubIdInput = document.getElementById("clubId");
const nombreClubInput = document.getElementById("nombreClub");
const ciudadClubInput = document.getElementById("ciudadClub");
const estadoClubInput = document.getElementById("estadoClub");
const paisClubInput = document.getElementById("paisClub");
const telefonoClubInput = document.getElementById("telefonoClub");
const direccionClubInput = document.getElementById("direccionClub");
const clubActivoInput = document.getElementById("clubActivo");

const tituloModalClub = document.getElementById("tituloModalClub");
const mensajeErrorClub = document.getElementById("mensajeErrorClub");

const listaClubesElemento = document.getElementById("listaClubes");
const mensajeSinClubes = document.getElementById("mensajeSinClubes");

const cantidadClubes = document.getElementById("cantidadClubes");
const cantidadClubesActivos = document.getElementById("cantidadClubesActivos");

const buscarClubInput = document.getElementById("buscarClub");

const modalEliminarClub = document.getElementById("modalEliminarClub");

const nombreClubEliminar = document.getElementById("nombreClubEliminar");

const btnCancelarEliminarClub = document.getElementById(
  "btnCancelarEliminarClub",
);

const btnConfirmarEliminarClub = document.getElementById(
  "btnConfirmarEliminarClub",
);

const notificacionClub = document.getElementById("notificacionClub");

let clubPendienteEliminarId = null;

/* =====================================================
   ABRIR Y CERRAR MODAL
===================================================== */

function abrirModalNuevoClub() {
  formularioClub.reset();

  clubIdInput.value = "";
  paisClubInput.value = "México";
  clubActivoInput.checked = true;

  tituloModalClub.textContent = "Registrar club";

  ocultarErrorClub();

  modalClub.classList.remove("oculto");

  setTimeout(() => {
    nombreClubInput.focus();
  }, 100);
}

function cerrarModalClub() {
  modalClub.classList.add("oculto");
  formularioClub.reset();
  clubIdInput.value = "";
  ocultarErrorClub();
}

function abrirModalEditarClub(clubId) {
  const clubes = obtenerClubes();

  const club = clubes.find((clubActual) => clubActual.id === clubId);

  if (!club) {
    mostrarNotificacion("No se encontró el club.");
    return;
  }

  clubIdInput.value = club.id;
  nombreClubInput.value = club.nombre || "";
  ciudadClubInput.value = club.ciudad || "";
  estadoClubInput.value = club.estado || "";
  paisClubInput.value = club.pais || "México";
  telefonoClubInput.value = club.telefono || "";
  direccionClubInput.value = club.direccion || "";
  clubActivoInput.checked = club.activo !== false;

  tituloModalClub.textContent = "Editar club";

  ocultarErrorClub();

  modalClub.classList.remove("oculto");
}

/* =====================================================
   VALIDACIÓN
===================================================== */

function mostrarErrorClub(mensaje) {
  mensajeErrorClub.textContent = mensaje;
  mensajeErrorClub.classList.remove("oculto");
}

function ocultarErrorClub() {
  mensajeErrorClub.textContent = "";
  mensajeErrorClub.classList.add("oculto");
}

function validarFormularioClub() {
  const nombre = nombreClubInput.value.trim();
  const ciudad = ciudadClubInput.value.trim();
  const estado = estadoClubInput.value.trim();
  const pais = paisClubInput.value.trim();

  if (!nombre) {
    mostrarErrorClub("Escribe el nombre del club.");
    nombreClubInput.focus();
    return false;
  }

  if (!ciudad) {
    mostrarErrorClub("Escribe la ciudad del club.");
    ciudadClubInput.focus();
    return false;
  }

  if (!estado) {
    mostrarErrorClub("Escribe el estado del club.");
    estadoClubInput.focus();
    return false;
  }

  if (!pais) {
    mostrarErrorClub("Escribe el país del club.");
    paisClubInput.focus();
    return false;
  }

  ocultarErrorClub();
  return true;
}

/* =====================================================
   GUARDAR O EDITAR CLUB
===================================================== */

function guardarFormularioClub(evento) {
  evento.preventDefault();

  if (!validarFormularioClub()) {
    return;
  }

  const clubes = obtenerClubes();

  const idClub = clubIdInput.value.trim();

  const datosClub = {
    nombre: nombreClubInput.value.trim(),
    ciudad: ciudadClubInput.value.trim(),
    estado: estadoClubInput.value.trim(),
    pais: paisClubInput.value.trim(),
    telefono: telefonoClubInput.value.trim(),
    direccion: direccionClubInput.value.trim(),
    activo: clubActivoInput.checked,
  };

  if (idClub) {
    const indiceClub = clubes.findIndex((club) => club.id === idClub);

    if (indiceClub === -1) {
      mostrarErrorClub("No se encontró el club.");
      return;
    }

    clubes[indiceClub] = {
      ...clubes[indiceClub],
      ...datosClub,
      fechaActualizacion: new Date().toISOString(),
    };

    guardarClubes(clubes);

    mostrarNotificacion("Club actualizado correctamente.");
  } else {
    const nuevoClub = {
      id: crearId("club"),
      ...datosClub,
      campos: [],
      fechaCreacion: new Date().toISOString(),
    };

    clubes.push(nuevoClub);

    guardarClubes(clubes);

    mostrarNotificacion("Club registrado correctamente.");
  }

  cerrarModalClub();
  mostrarClubes();
}

/* =====================================================
   MOSTRAR CLUBES
===================================================== */

function mostrarClubes(filtro = "") {
  const clubes = obtenerClubes();

  const textoFiltro = filtro.trim().toLowerCase();

  const clubesFiltrados = clubes.filter((club) => {
    const textoClub = `
      ${club.nombre || ""}
      ${club.ciudad || ""}
      ${club.estado || ""}
      ${club.pais || ""}
    `.toLowerCase();

    return textoClub.includes(textoFiltro);
  });

  listaClubesElemento.innerHTML = "";

  cantidadClubes.textContent = clubes.length;

  cantidadClubesActivos.textContent = clubes.filter(
    (club) => club.activo !== false,
  ).length;

  if (clubesFiltrados.length === 0) {
    mensajeSinClubes.classList.remove("oculto");

    if (clubes.length > 0 && textoFiltro) {
      mensajeSinClubes.querySelector("h2").textContent =
        "No se encontraron clubes";

      mensajeSinClubes.querySelector("p").textContent =
        "Prueba escribiendo otro nombre, ciudad o estado.";

      btnPrimerClub.classList.add("oculto");
    } else {
      mensajeSinClubes.querySelector("h2").textContent =
        "No hay clubes registrados";

      mensajeSinClubes.querySelector("p").textContent =
        "Registra el primer club para comenzar a configurar sus campos, salidas y hoyos.";

      btnPrimerClub.classList.remove("oculto");
    }

    return;
  }

  mensajeSinClubes.classList.add("oculto");

  clubesFiltrados.forEach((club) => {
    const cantidadCampos = Array.isArray(club.campos) ? club.campos.length : 0;

    const cantidadSalidas = contarSalidasClub(club);
    const cantidadHoyos = contarHoyosClub(club);

    const tarjeta = document.createElement("article");

    tarjeta.className = "tarjetaClub";

    tarjeta.innerHTML = `
      <div class="encabezadoTarjetaClub">

        <div class="informacionClub">

          <div class="iconoClub">
            ⛳
          </div>

          <div class="datosClub">

            <h3>${escaparHTML(club.nombre)}</h3>

            <p class="ubicacionClub">
              📍 ${escaparHTML(club.ciudad)},
              ${escaparHTML(club.estado)}
            </p>

            ${
              club.direccion
                ? `
                  <p class="direccionTarjetaClub">
                    ${escaparHTML(club.direccion)}
                  </p>
                `
                : ""
            }

          </div>

        </div>

        <span class="estadoClub ${
          club.activo !== false ? "activo" : "inactivo"
        }">
          ${club.activo !== false ? "Activo" : "Inactivo"}
        </span>

      </div>

      <div class="resumenTarjetaClub">

        <div>
          <span>Campos</span>
          <strong>${cantidadCampos}</strong>
        </div>

        <div>
          <span>Salidas</span>
          <strong>${cantidadSalidas}</strong>
        </div>

        <div>
          <span>Hoyos</span>
          <strong>${cantidadHoyos}</strong>
        </div>

      </div>

      <div class="accionesTarjetaClub">

        <button
          class="btnAdministrarClub"
          type="button"
          data-accion="administrar"
          data-id="${club.id}"
        >
          ⚙️ Administrar
        </button>

        <button
          class="btnEditarClub"
          type="button"
          data-accion="editar"
          data-id="${club.id}"
        >
          ✏️ Editar
        </button>

        <button
          class="btnEliminarClub"
          type="button"
          data-accion="eliminar"
          data-id="${club.id}"
          aria-label="Eliminar club"
        >
          🗑️
        </button>

      </div>
    `;

    listaClubesElemento.appendChild(tarjeta);
  });
}

/* =====================================================
   CONTADORES DE DATOS DEL CLUB
===================================================== */

function contarSalidasClub(club) {
  if (!Array.isArray(club.campos)) {
    return 0;
  }

  return club.campos.reduce((total, campo) => {
    const salidas = Array.isArray(campo.salidas) ? campo.salidas.length : 0;

    return total + salidas;
  }, 0);
}

function contarHoyosClub(club) {
  if (!Array.isArray(club.campos)) {
    return 0;
  }

  return club.campos.reduce((total, campo) => {
    const hoyos = Array.isArray(campo.hoyos) ? campo.hoyos.length : 0;

    return total + hoyos;
  }, 0);
}

/* =====================================================
   ELIMINAR CLUB
===================================================== */

function abrirModalEliminarClub(clubId) {
  const clubes = obtenerClubes();

  const club = clubes.find((clubActual) => clubActual.id === clubId);

  if (!club) {
    mostrarNotificacion("No se encontró el club.");
    return;
  }

  clubPendienteEliminarId = clubId;

  nombreClubEliminar.textContent = club.nombre;

  modalEliminarClub.classList.remove("oculto");
}

function cerrarModalEliminarClub() {
  modalEliminarClub.classList.add("oculto");
  clubPendienteEliminarId = null;
}

function eliminarClubConfirmado() {
  if (!clubPendienteEliminarId) {
    return;
  }

  const clubes = obtenerClubes();

  const clubesActualizados = clubes.filter(
    (club) => club.id !== clubPendienteEliminarId,
  );

  guardarClubes(clubesActualizados);

  cerrarModalEliminarClub();

  mostrarClubes(buscarClubInput.value);

  mostrarNotificacion("Club eliminado correctamente.");
}

/* =====================================================
   ADMINISTRAR CLUB
===================================================== */

function administrarClub(clubId) {
  localStorage.setItem("golfScoreClubSeleccionado", clubId);

  /*
    Más adelante esta página tendrá:
    - Campos
    - Salidas
    - Hoyos
  */

  window.location.href = "administrar-club.html";
}

/* =====================================================
   NOTIFICACIÓN
===================================================== */

let temporizadorNotificacion = null;

function mostrarNotificacion(mensaje) {
  notificacionClub.textContent = mensaje;
  notificacionClub.classList.remove("oculto");

  clearTimeout(temporizadorNotificacion);

  temporizadorNotificacion = setTimeout(() => {
    notificacionClub.classList.add("oculto");
  }, 2600);
}

/* =====================================================
   SEGURIDAD PARA MOSTRAR TEXTO
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
   EVENTOS
===================================================== */

if (btnNuevoClub) {
  btnNuevoClub.addEventListener("click", abrirModalNuevoClub);
}

if (btnPrimerClub) {
  btnPrimerClub.addEventListener("click", abrirModalNuevoClub);
}

if (btnCerrarModalClub) {
  btnCerrarModalClub.addEventListener("click", cerrarModalClub);
}

if (btnCancelarClub) {
  btnCancelarClub.addEventListener("click", cerrarModalClub);
}

if (formularioClub) {
  formularioClub.addEventListener("submit", guardarFormularioClub);
}

if (buscarClubInput) {
  buscarClubInput.addEventListener("input", () => {
    mostrarClubes(buscarClubInput.value);
  });
}

if (listaClubesElemento) {
  listaClubesElemento.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton) {
      return;
    }

    const clubId = boton.dataset.id;
    const accion = boton.dataset.accion;

    if (accion === "administrar") {
      administrarClub(clubId);
    }

    if (accion === "editar") {
      abrirModalEditarClub(clubId);
    }

    if (accion === "eliminar") {
      abrirModalEliminarClub(clubId);
    }
  });
}

if (btnCancelarEliminarClub) {
  btnCancelarEliminarClub.addEventListener("click", cerrarModalEliminarClub);
}

if (btnConfirmarEliminarClub) {
  btnConfirmarEliminarClub.addEventListener("click", eliminarClubConfirmado);
}

if (modalClub) {
  modalClub.addEventListener("click", (evento) => {
    if (evento.target === modalClub) {
      cerrarModalClub();
    }
  });
}

if (modalEliminarClub) {
  modalEliminarClub.addEventListener("click", (evento) => {
    if (evento.target === modalEliminarClub) {
      cerrarModalEliminarClub();
    }
  });
}

/* =====================================================
   INICIAR PÁGINA
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  mostrarClubes();
});
