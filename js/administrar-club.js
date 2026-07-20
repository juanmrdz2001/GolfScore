/* =====================================================
   DATOS DEL CLUB SELECCIONADO
===================================================== */

const CLAVE_CLUB_SELECCIONADO = "golfScoreClubSeleccionado";

let clubAdministradoId = localStorage.getItem(CLAVE_CLUB_SELECCIONADO);

let campoEditandoId = null;

/* =====================================================
   ELEMENTOS
===================================================== */

const nombreClubAdministrado = document.getElementById(
  "nombreClubAdministrado",
);

const ciudadClubAdministrado = document.getElementById(
  "ciudadClubAdministrado",
);

const estadoClubAdministrado = document.getElementById(
  "estadoClubAdministrado",
);

const listaCampos = document.getElementById("listaCampos");
const mensajeSinCampos = document.getElementById("mensajeSinCampos");

const btnNuevoCampo = document.getElementById("btnNuevoCampo");

const btnPrimerCampo = document.getElementById("btnPrimerCampo");

const modalCampo = document.getElementById("modalCampo");

const formularioCampo = document.getElementById("formularioCampo");

const campoIdInput = document.getElementById("campoId");
const nombreCampoInput = document.getElementById("nombreCampo");

const totalHoyosCampoInput = document.getElementById("totalHoyosCampo");

const descripcionCampoInput = document.getElementById("descripcionCampo");

const campoActivoInput = document.getElementById("campoActivo");

const tituloModalCampo = document.getElementById("tituloModalCampo");

const mensajeErrorCampo = document.getElementById("mensajeErrorCampo");

const btnCerrarModalCampo = document.getElementById("btnCerrarModalCampo");

const btnCancelarCampo = document.getElementById("btnCancelarCampo");

const notificacionCampo = document.getElementById("notificacionCampo");

/* =====================================================
   OBTENER CLUB ACTUAL
===================================================== */

function obtenerClubAdministrado() {
  const clubes = obtenerClubes();

  return clubes.find((club) => club.id === clubAdministradoId) || null;
}

/* =====================================================
   MOSTRAR INFORMACIÓN DEL CLUB
===================================================== */

function mostrarInformacionClub() {
  const club = obtenerClubAdministrado();

  if (!club) {
    window.location.href = "club.html";
    return;
  }

  nombreClubAdministrado.textContent = `⛳ ${club.nombre}`;

  ciudadClubAdministrado.textContent = club.ciudad || "-";

  estadoClubAdministrado.textContent = club.estado || "-";
}

/* =====================================================
   MOSTRAR CAMPOS
===================================================== */

function mostrarCampos() {
  const club = obtenerClubAdministrado();

  if (!club) {
    return;
  }

  const campos = Array.isArray(club.campos) ? club.campos : [];

  listaCampos.innerHTML = "";

  if (campos.length === 0) {
    mensajeSinCampos.classList.remove("oculto");
    return;
  }

  mensajeSinCampos.classList.add("oculto");

  campos.forEach((campo) => {
    const salidas = Array.isArray(campo.salidas) ? campo.salidas.length : 0;

    const hoyos = Array.isArray(campo.hoyos) ? campo.hoyos.length : 0;

    const tarjeta = document.createElement("article");

    tarjeta.className = "tarjetaCampo";

    tarjeta.innerHTML = `
      <div class="encabezadoTarjetaCampo">

        <div>
          <span class="etiquetaCampo">
            Campo
          </span>

          <h3>
            ${escaparHTML(campo.nombre)}
          </h3>

          ${
            campo.descripcion
              ? `
                <p>
                  ${escaparHTML(campo.descripcion)}
                </p>
              `
              : ""
          }
        </div>

        <span class="estadoClub ${
          campo.activo !== false ? "activo" : "inactivo"
        }">
          ${campo.activo !== false ? "Activo" : "Inactivo"}
        </span>

      </div>

      <div class="resumenTarjetaCampo">

        <div>
          <span>Configurados</span>
          <strong>
            ${hoyos}/${campo.totalHoyos}
          </strong>
          <small>Hoyos</small>
        </div>

        <div>
          <span>Salidas</span>
          <strong>${salidas}</strong>
          <small>Registradas</small>
        </div>

        <div>
          <span>Par total</span>
          <strong>
            ${calcularParCampo(campo)}
          </strong>
          <small>Golpes</small>
        </div>

      </div>

      <div class="accionesCampo">

        <button
          class="btnConfigurarSalidas"
          type="button"
          data-accion="salidas"
          data-id="${campo.id}"
        >
          🚩 Salidas
        </button>

        <button
          class="btnConfigurarHoyos"
          type="button"
          data-accion="hoyos"
          data-id="${campo.id}"
        >
          🕳️ Hoyos
        </button>

        <button
          class="btnEditarCampo"
          type="button"
          data-accion="editar"
          data-id="${campo.id}"
        >
          ✏️
        </button>

      </div>
    `;

    listaCampos.appendChild(tarjeta);
  });
}

/* =====================================================
   CALCULAR PAR
===================================================== */

function calcularParCampo(campo) {
  if (!Array.isArray(campo.hoyos)) {
    return 0;
  }

  return campo.hoyos.reduce((total, hoyo) => total + Number(hoyo.par || 0), 0);
}

/* =====================================================
   MODAL CAMPO
===================================================== */

function abrirModalNuevoCampo() {
  formularioCampo.reset();

  campoIdInput.value = "";
  campoEditandoId = null;

  totalHoyosCampoInput.value = "18";
  campoActivoInput.checked = true;

  tituloModalCampo.textContent = "Registrar campo";

  ocultarErrorCampo();

  modalCampo.classList.remove("oculto");

  setTimeout(() => {
    nombreCampoInput.focus();
  }, 100);
}

function abrirModalEditarCampo(campoId) {
  const club = obtenerClubAdministrado();

  if (!club) {
    return;
  }

  const campo = club.campos.find((campoActual) => campoActual.id === campoId);

  if (!campo) {
    mostrarNotificacionCampo("No se encontró el campo.");
    return;
  }

  campoEditandoId = campoId;
  campoIdInput.value = campoId;

  nombreCampoInput.value = campo.nombre || "";
  totalHoyosCampoInput.value = String(campo.totalHoyos || 18);

  descripcionCampoInput.value = campo.descripcion || "";

  campoActivoInput.checked = campo.activo !== false;

  tituloModalCampo.textContent = "Editar campo";

  ocultarErrorCampo();

  modalCampo.classList.remove("oculto");
}

function cerrarModalCampo() {
  modalCampo.classList.add("oculto");

  formularioCampo.reset();

  campoEditandoId = null;
  campoIdInput.value = "";

  ocultarErrorCampo();
}

/* =====================================================
   ERROR
===================================================== */

function mostrarErrorCampo(mensaje) {
  mensajeErrorCampo.textContent = mensaje;
  mensajeErrorCampo.classList.remove("oculto");
}

function ocultarErrorCampo() {
  mensajeErrorCampo.textContent = "";
  mensajeErrorCampo.classList.add("oculto");
}

/* =====================================================
   GUARDAR CAMPO
===================================================== */

function guardarCampo(evento) {
  evento.preventDefault();

  const nombre = nombreCampoInput.value.trim();

  if (!nombre) {
    mostrarErrorCampo("Escribe el nombre del campo.");

    nombreCampoInput.focus();
    return;
  }

  const clubes = obtenerClubes();

  const club = clubes.find(
    (clubActual) => clubActual.id === clubAdministradoId,
  );

  if (!club) {
    mostrarErrorCampo("No se encontró el club.");
    return;
  }

  if (!Array.isArray(club.campos)) {
    club.campos = [];
  }

  const datosCampo = {
    nombre,
    totalHoyos: Number(totalHoyosCampoInput.value),
    descripcion: descripcionCampoInput.value.trim(),
    activo: campoActivoInput.checked,
  };

  if (campoEditandoId) {
    const campo = club.campos.find(
      (campoActual) => campoActual.id === campoEditandoId,
    );

    if (!campo) {
      mostrarErrorCampo("No se encontró el campo.");
      return;
    }

    Object.assign(campo, {
      ...datosCampo,
      fechaActualizacion: new Date().toISOString(),
    });

    mostrarNotificacionCampo("Campo actualizado correctamente.");
  } else {
    club.campos.push({
      id: crearId("campo"),
      ...datosCampo,
      salidas: [],
      hoyos: [],
      fechaCreacion: new Date().toISOString(),
    });

    mostrarNotificacionCampo("Campo registrado correctamente.");
  }

  guardarClubes(clubes);

  cerrarModalCampo();
  mostrarCampos();
}

/* =====================================================
   ABRIR SALIDAS Y HOYOS
===================================================== */

function abrirSalidas(campoId) {
  localStorage.setItem("golfScoreCampoSeleccionado", campoId);

  window.location.href = "salidas.html";
}

function abrirHoyos(campoId) {
  localStorage.setItem("golfScoreCampoSeleccionado", campoId);

  window.location.href = "hoyos.html";
}

/* =====================================================
   NOTIFICACIÓN
===================================================== */

let temporizadorNotificacionCampo = null;

function mostrarNotificacionCampo(mensaje) {
  notificacionCampo.textContent = mensaje;
  notificacionCampo.classList.remove("oculto");

  clearTimeout(temporizadorNotificacionCampo);

  temporizadorNotificacionCampo = setTimeout(() => {
    notificacionCampo.classList.add("oculto");
  }, 2500);
}

/* =====================================================
   EVENTOS
===================================================== */

btnNuevoCampo?.addEventListener("click", abrirModalNuevoCampo);

btnPrimerCampo?.addEventListener("click", abrirModalNuevoCampo);

btnCerrarModalCampo?.addEventListener("click", cerrarModalCampo);

btnCancelarCampo?.addEventListener("click", cerrarModalCampo);

formularioCampo?.addEventListener("submit", guardarCampo);

listaCampos?.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");

  if (!boton) {
    return;
  }

  const campoId = boton.dataset.id;
  const accion = boton.dataset.accion;

  if (accion === "salidas") {
    abrirSalidas(campoId);
  }

  if (accion === "hoyos") {
    abrirHoyos(campoId);
  }

  if (accion === "editar") {
    abrirModalEditarCampo(campoId);
  }
});

modalCampo?.addEventListener("click", (evento) => {
  if (evento.target === modalCampo) {
    cerrarModalCampo();
  }
});

/* =====================================================
   INICIAR
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  mostrarInformacionClub();
  mostrarCampos();
});
