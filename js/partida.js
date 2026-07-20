/* =====================================================
   CLAVES DE ALMACENAMIENTO
===================================================== */

const CLAVE_PARTIDAS = "golfScorePartidas";
const CLAVE_PARTIDA_ACTUAL = "golfScorePartidaActual";

let jugadoresSeleccionadosPartida = [];
let partidaCreadaId = null;

/* =====================================================
   ELEMENTOS
===================================================== */

const formularioNuevaPartida = document.getElementById(
  "formularioNuevaPartida",
);

const nombrePartidaInput = document.getElementById("nombrePartida");

const fechaPartidaInput = document.getElementById("fechaPartida");

const horaPartidaInput = document.getElementById("horaPartida");

const clubPartidaInput = document.getElementById("clubPartida");

const campoPartidaInput = document.getElementById("campoPartida");

const recorridoPartidaInput = document.getElementById("recorridoPartida");

const grupoRecorrido9Hoyos = document.getElementById("grupoRecorrido9Hoyos");

const resumenCampoPartida = document.getElementById("resumenCampoPartida");

const hoyosConfiguradosPartida = document.getElementById(
  "hoyosConfiguradosPartida",
);

const parCampoPartida = document.getElementById("parCampoPartida");

const salidasCampoPartida = document.getElementById("salidasCampoPartida");

const buscarJugadorPartidaInput = document.getElementById(
  "buscarJugadorPartida",
);

const listaJugadoresPartida = document.getElementById("listaJugadoresPartida");

const mensajeSinJugadoresPartida = document.getElementById(
  "mensajeSinJugadoresPartida",
);

const cantidadJugadoresSeleccionados = document.getElementById(
  "cantidadJugadoresSeleccionados",
);

const seccionJugadoresElegidos = document.getElementById(
  "seccionJugadoresElegidos",
);

const listaJugadoresElegidos = document.getElementById(
  "listaJugadoresElegidos",
);

const observacionesPartidaInput = document.getElementById(
  "observacionesPartida",
);

const mensajeErrorPartida = document.getElementById("mensajeErrorPartida");

const resumenClubCampoPartida = document.getElementById(
  "resumenClubCampoPartida",
);

const resumenJugadoresPartida = document.getElementById(
  "resumenJugadoresPartida",
);

const resumenRecorridoPartida = document.getElementById(
  "resumenRecorridoPartida",
);

const modalPartidaCreada = document.getElementById("modalPartidaCreada");

const btnIrMarcador = document.getElementById("btnIrMarcador");

const notificacionPartida = document.getElementById("notificacionPartida");

/* =====================================================
   OBTENER Y GUARDAR PARTIDAS
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
   FECHA Y HORA ACTUAL
===================================================== */

function colocarFechaHoraActual() {
  const ahora = new Date();

  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");

  const dia = String(ahora.getDate()).padStart(2, "0");

  const hora = String(ahora.getHours()).padStart(2, "0");

  const minutos = String(ahora.getMinutes()).padStart(2, "0");

  fechaPartidaInput.value = `${anio}-${mes}-${dia}`;

  horaPartidaInput.value = `${hora}:${minutos}`;
}

/* =====================================================
   CLUBES
===================================================== */

function llenarClubesPartida() {
  const clubes = obtenerClubes().filter((club) => club.activo !== false);

  clubPartidaInput.innerHTML = `
    <option value="">
      Selecciona un club
    </option>
  `;

  clubes.forEach((club) => {
    const opcion = document.createElement("option");

    opcion.value = club.id;
    opcion.textContent = club.nombre;

    clubPartidaInput.appendChild(opcion);
  });
}

/* =====================================================
   CAMPOS
===================================================== */

function llenarCamposPartida(clubId) {
  campoPartidaInput.innerHTML = `
    <option value="">
      Selecciona un campo
    </option>
  `;

  resumenCampoPartida.classList.add("oculto");

  const club = obtenerClubes().find((clubActual) => clubActual.id === clubId);

  if (!club || !Array.isArray(club.campos)) {
    campoPartidaInput.disabled = true;
    actualizarResumenFinalPartida();
    return;
  }

  const camposActivos = club.campos.filter((campo) => campo.activo !== false);

  if (camposActivos.length === 0) {
    campoPartidaInput.innerHTML = `
      <option value="">
        El club no tiene campos activos
      </option>
    `;

    campoPartidaInput.disabled = true;
    actualizarResumenFinalPartida();
    return;
  }

  camposActivos.forEach((campo) => {
    const opcion = document.createElement("option");

    opcion.value = campo.id;
    opcion.textContent = campo.nombre;

    campoPartidaInput.appendChild(opcion);
  });

  campoPartidaInput.disabled = false;

  actualizarResumenFinalPartida();
}

/* =====================================================
   OBTENER CLUB Y CAMPO SELECCIONADOS
===================================================== */

function obtenerClubSeleccionadoPartida() {
  return (
    obtenerClubes().find((club) => club.id === clubPartidaInput.value) || null
  );
}

function obtenerCampoSeleccionadoPartida() {
  const club = obtenerClubSeleccionadoPartida();

  if (!club || !Array.isArray(club.campos)) {
    return null;
  }

  return (
    club.campos.find((campo) => campo.id === campoPartidaInput.value) || null
  );
}

/* =====================================================
   MOSTRAR DATOS DEL CAMPO
===================================================== */

function mostrarDatosCampoPartida() {
  const campo = obtenerCampoSeleccionadoPartida();

  if (!campo) {
    resumenCampoPartida.classList.add("oculto");
    actualizarResumenFinalPartida();
    return;
  }

  const hoyos = Array.isArray(campo.hoyos) ? campo.hoyos : [];

  const salidas = Array.isArray(campo.salidas)
    ? campo.salidas.filter((salida) => salida.activa !== false)
    : [];

  const parTotal = hoyos.reduce(
    (total, hoyo) => total + Number(hoyo.par || 0),
    0,
  );

  hoyosConfiguradosPartida.textContent = `${hoyos.length}/${campo.totalHoyos || 18}`;

  parCampoPartida.textContent = parTotal;
  salidasCampoPartida.textContent = salidas.length;

  resumenCampoPartida.classList.remove("oculto");

  ajustarOpcionesCantidadHoyos(campo);
  actualizarSalidasJugadoresElegidos();
  actualizarResumenFinalPartida();
}

/* =====================================================
   9 O 18 HOYOS
===================================================== */

function obtenerCantidadHoyosSeleccionada() {
  const opcion = document.querySelector('input[name="cantidadHoyos"]:checked');

  return Number(opcion?.value || 18);
}

function ajustarOpcionesCantidadHoyos(campo) {
  const radio18 = document.querySelector(
    'input[name="cantidadHoyos"][value="18"]',
  );

  const radio9 = document.querySelector(
    'input[name="cantidadHoyos"][value="9"]',
  );

  const totalCampo = Number(campo.totalHoyos || 18);

  if (totalCampo === 9) {
    radio9.checked = true;
    radio18.disabled = true;
  } else {
    radio18.disabled = false;
  }

  mostrarOcultarRecorrido9();
}

function mostrarOcultarRecorrido9() {
  const cantidad = obtenerCantidadHoyosSeleccionada();

  if (cantidad === 9) {
    grupoRecorrido9Hoyos.classList.remove("oculto");
  } else {
    grupoRecorrido9Hoyos.classList.add("oculto");
  }

  actualizarResumenFinalPartida();
}

/* =====================================================
   JUGADORES DISPONIBLES
===================================================== */

function mostrarJugadoresDisponibles(filtro = "") {
  const jugadores = obtenerJugadores().filter(
    (jugador) => jugador.activo !== false,
  );

  const textoFiltro = filtro.trim().toLowerCase();

  const jugadoresFiltrados = jugadores.filter((jugador) => {
    const texto = `
        ${jugador.nombre || ""}
        ${jugador.alias || ""}
        ${jugador.clubNombre || ""}
      `.toLowerCase();

    return texto.includes(textoFiltro);
  });

  listaJugadoresPartida.innerHTML = "";

  if (jugadoresFiltrados.length === 0) {
    mensajeSinJugadoresPartida.classList.remove("oculto");

    return;
  }

  mensajeSinJugadoresPartida.classList.add("oculto");

  jugadoresFiltrados.forEach((jugador) => {
    const estaSeleccionado = jugadoresSeleccionadosPartida.some(
      (seleccionado) => seleccionado.jugadorId === jugador.id,
    );

    const boton = document.createElement("button");

    boton.type = "button";

    boton.className = estaSeleccionado
      ? "tarjetaSeleccionJugador seleccionado"
      : "tarjetaSeleccionJugador";

    boton.dataset.jugadorId = jugador.id;

    boton.innerHTML = `
      <span class="avatarSeleccionJugador">
        ${obtenerInicialesPartida(jugador.nombre)}
      </span>

      <span class="datosSeleccionJugador">

        <strong>
          ${escaparTextoPartida(jugador.alias)}
        </strong>

        <small>
          ${escaparTextoPartida(jugador.nombre)}
        </small>

        <small>
          Hándicap:
          ${Number(jugador.handicap || 0).toFixed(1)}
        </small>

      </span>

      <span class="marcaSeleccionJugador">
        ${estaSeleccionado ? "✓" : "+"}
      </span>
    `;

    listaJugadoresPartida.appendChild(boton);
  });
}

/* =====================================================
   SELECCIONAR JUGADOR
===================================================== */

function alternarJugadorPartida(jugadorId) {
  const indice = jugadoresSeleccionadosPartida.findIndex(
    (jugador) => jugador.jugadorId === jugadorId,
  );

  if (indice >= 0) {
    jugadoresSeleccionadosPartida.splice(indice, 1);
  } else {
    if (jugadoresSeleccionadosPartida.length >= 6) {
      mostrarNotificacionPartida(
        "La partida permite un máximo de 6 jugadores.",
      );

      return;
    }

    const jugador = obtenerJugadores().find(
      (jugadorActual) => jugadorActual.id === jugadorId,
    );

    if (!jugador) {
      return;
    }

    jugadoresSeleccionadosPartida.push({
      jugadorId: jugador.id,
      nombre: jugador.nombre,
      alias: jugador.alias,
      handicap: Number(jugador.handicap || 0),

      salidaId: jugador.salidaPreferidaId || "",

      salidaNombre: jugador.salidaPreferidaNombre || "",

      salidaColor: jugador.salidaPreferidaColor || "",

      organizador: jugadoresSeleccionadosPartida.length === 0,
    });
  }

  actualizarSeleccionJugadores();
}

/* =====================================================
   ACTUALIZAR JUGADORES SELECCIONADOS
===================================================== */

function actualizarSeleccionJugadores() {
  cantidadJugadoresSeleccionados.textContent =
    jugadoresSeleccionadosPartida.length;

  mostrarJugadoresDisponibles(buscarJugadorPartidaInput.value);

  mostrarJugadoresElegidos();
  actualizarResumenFinalPartida();
}

/* =====================================================
   MOSTRAR ELEGIDOS
===================================================== */

function mostrarJugadoresElegidos() {
  listaJugadoresElegidos.innerHTML = "";

  if (jugadoresSeleccionadosPartida.length === 0) {
    seccionJugadoresElegidos.classList.add("oculto");

    return;
  }

  seccionJugadoresElegidos.classList.remove("oculto");

  const campo = obtenerCampoSeleccionadoPartida();

  const salidas =
    campo && Array.isArray(campo.salidas)
      ? campo.salidas.filter((salida) => salida.activa !== false)
      : [];

  jugadoresSeleccionadosPartida.forEach((jugador, indice) => {
    const tarjeta = document.createElement("article");

    tarjeta.className = "tarjetaJugadorElegido";

    const opcionesSalidas = salidas
      .map(
        (salida) => `
            <option
              value="${salida.id}"
              ${salida.id === jugador.salidaId ? "selected" : ""}
            >
              ${escaparTextoPartida(salida.nombre)}
            </option>
          `,
      )
      .join("");

    tarjeta.innerHTML = `
        <div class="cabeceraJugadorElegido">

          <div class="numeroOrdenJugador">
            ${indice + 1}
          </div>

          <div class="nombreJugadorElegido">

            <strong>
              ${escaparTextoPartida(jugador.alias)}
            </strong>

            <small>
              ${escaparTextoPartida(jugador.nombre)}
            </small>

          </div>

          <button
            class="btnQuitarJugador"
            type="button"
            data-accion="quitar"
            data-jugador-id="${jugador.jugadorId}"
            aria-label="Quitar jugador"
          >
            ×
          </button>

        </div>


        <div class="configuracionJugadorElegido">

          <div class="grupoFormulario">

            <label>
              Salida para esta ronda
            </label>

            <select
              class="selectSalidaPartida"
              data-jugador-id="${jugador.jugadorId}"
              ${salidas.length === 0 ? "disabled" : ""}
            >
              <option value="">
                Selecciona una salida
              </option>

              ${opcionesSalidas}
            </select>

          </div>


          <label class="opcionOrganizador">

            <input
              type="radio"
              name="organizadorPartida"
              value="${jugador.jugadorId}"
              ${jugador.organizador ? "checked" : ""}
            >

            <span>
              Organizador de la partida
            </span>

          </label>

        </div>
      `;

    listaJugadoresElegidos.appendChild(tarjeta);
  });
}

/* =====================================================
   ACTUALIZAR SALIDAS AL CAMBIAR CAMPO
===================================================== */

function actualizarSalidasJugadoresElegidos() {
  const campo = obtenerCampoSeleccionadoPartida();

  if (!campo || !Array.isArray(campo.salidas)) {
    mostrarJugadoresElegidos();
    return;
  }

  const salidasActivas = campo.salidas.filter(
    (salida) => salida.activa !== false,
  );

  jugadoresSeleccionadosPartida = jugadoresSeleccionadosPartida.map(
    (jugador) => {
      const salidaActualValida = salidasActivas.find(
        (salida) => salida.id === jugador.salidaId,
      );

      if (salidaActualValida) {
        return {
          ...jugador,
          salidaNombre: salidaActualValida.nombre,
          salidaColor: salidaActualValida.color,
        };
      }

      const primeraSalida = salidasActivas[0];

      return {
        ...jugador,
        salidaId: primeraSalida?.id || "",
        salidaNombre: primeraSalida?.nombre || "",
        salidaColor: primeraSalida?.color || "",
      };
    },
  );

  mostrarJugadoresElegidos();
}

/* =====================================================
   CAMBIAR SALIDA
===================================================== */

function cambiarSalidaJugador(jugadorId, salidaId) {
  const campo = obtenerCampoSeleccionadoPartida();

  if (!campo || !Array.isArray(campo.salidas)) {
    return;
  }

  const salida = campo.salidas.find(
    (salidaActual) => salidaActual.id === salidaId,
  );

  const jugador = jugadoresSeleccionadosPartida.find(
    (jugadorActual) => jugadorActual.jugadorId === jugadorId,
  );

  if (!jugador) {
    return;
  }

  jugador.salidaId = salida?.id || "";
  jugador.salidaNombre = salida?.nombre || "";
  jugador.salidaColor = salida?.color || "";
}

/* =====================================================
   ORGANIZADOR
===================================================== */

function cambiarOrganizador(jugadorId) {
  jugadoresSeleccionadosPartida = jugadoresSeleccionadosPartida.map(
    (jugador) => ({
      ...jugador,
      organizador: jugador.jugadorId === jugadorId,
    }),
  );
}

/* =====================================================
   QUITAR JUGADOR
===================================================== */

function quitarJugadorPartida(jugadorId) {
  const eraOrganizador = jugadoresSeleccionadosPartida.some(
    (jugador) => jugador.jugadorId === jugadorId && jugador.organizador,
  );

  jugadoresSeleccionadosPartida = jugadoresSeleccionadosPartida.filter(
    (jugador) => jugador.jugadorId !== jugadorId,
  );

  if (eraOrganizador && jugadoresSeleccionadosPartida.length > 0) {
    jugadoresSeleccionadosPartida[0].organizador = true;
  }

  actualizarSeleccionJugadores();
}

/* =====================================================
   VALIDACIÓN DEL CAMPO
===================================================== */

function validarCampoCompleto(campo, cantidadHoyos, recorrido) {
  const hoyos = Array.isArray(campo.hoyos) ? campo.hoyos : [];

  let numerosNecesarios = [];

  if (cantidadHoyos === 18) {
    numerosNecesarios = Array.from({ length: 18 }, (_, indice) => indice + 1);
  } else if (recorrido === "vuelta") {
    numerosNecesarios = Array.from({ length: 9 }, (_, indice) => indice + 10);
  } else {
    numerosNecesarios = Array.from({ length: 9 }, (_, indice) => indice + 1);
  }

  const faltantes = numerosNecesarios.filter(
    (numero) => !hoyos.some((hoyo) => Number(hoyo.numero) === numero),
  );

  return faltantes;
}

/* =====================================================
   CREAR PARTIDA
===================================================== */

function crearNuevaPartida(evento) {
  evento.preventDefault();

  ocultarErrorPartida();

  const nombre = nombrePartidaInput.value.trim();

  const fecha = fechaPartidaInput.value;

  const hora = horaPartidaInput.value;

  const club = obtenerClubSeleccionadoPartida();

  const campo = obtenerCampoSeleccionadoPartida();

  const cantidadHoyos = obtenerCantidadHoyosSeleccionada();

  const recorrido =
    cantidadHoyos === 9 ? recorridoPartidaInput.value : "completo";

  if (!nombre) {
    mostrarErrorPartida("Escribe el nombre de la partida.");

    nombrePartidaInput.focus();
    return;
  }

  if (!fecha || !hora) {
    mostrarErrorPartida("Selecciona la fecha y hora de la partida.");

    return;
  }

  if (!club) {
    mostrarErrorPartida("Selecciona el club.");

    clubPartidaInput.focus();
    return;
  }

  if (!campo) {
    mostrarErrorPartida("Selecciona el campo.");

    campoPartidaInput.focus();
    return;
  }

  if (jugadoresSeleccionadosPartida.length === 0) {
    mostrarErrorPartida("Selecciona al menos un jugador.");

    return;
  }

  if (jugadoresSeleccionadosPartida.length > 6) {
    mostrarErrorPartida("Solo pueden participar hasta 6 jugadores.");

    return;
  }

  const jugadorSinSalida = jugadoresSeleccionadosPartida.find(
    (jugador) => !jugador.salidaId,
  );

  if (jugadorSinSalida) {
    mostrarErrorPartida(`Selecciona la salida de ${jugadorSinSalida.alias}.`);

    return;
  }

  const organizador = jugadoresSeleccionadosPartida.find(
    (jugador) => jugador.organizador,
  );

  if (!organizador) {
    mostrarErrorPartida("Selecciona al organizador de la partida.");

    return;
  }

  const hoyosFaltantes = validarCampoCompleto(campo, cantidadHoyos, recorrido);

  if (hoyosFaltantes.length > 0) {
    mostrarErrorPartida(
      `Falta configurar los hoyos: ${hoyosFaltantes.join(", ")}.`,
    );

    return;
  }

  const hoyosPartida = obtenerHoyosParaPartida(campo, cantidadHoyos, recorrido);

  const nuevaPartida = {
    id: crearId("partida"),

    nombre,
    fecha,
    hora,

    clubId: club.id,
    clubNombre: club.nombre,

    campoId: campo.id,
    campoNombre: campo.nombre,

    cantidadHoyos,
    recorrido,

    estado: "en_curso",

    jugadores: jugadoresSeleccionadosPartida.map((jugador, indice) => ({
      ...jugador,
      orden: indice + 1,
      scores: {},
      totalIda: 0,
      totalVuelta: 0,
      totalGeneral: 0,
    })),

    hoyos: hoyosPartida,

    observaciones: observacionesPartidaInput.value.trim(),

    fechaCreacion: new Date().toISOString(),

    fechaActualizacion: new Date().toISOString(),
  };

  const partidas = obtenerPartidas();

  partidas.push(nuevaPartida);

  guardarPartidas(partidas);

  localStorage.setItem(CLAVE_PARTIDA_ACTUAL, nuevaPartida.id);

  partidaCreadaId = nuevaPartida.id;

  modalPartidaCreada.classList.remove("oculto");
}

/* =====================================================
   HOYOS QUE PARTICIPAN EN LA RONDA
===================================================== */

function obtenerHoyosParaPartida(campo, cantidadHoyos, recorrido) {
  const hoyos = [...campo.hoyos].sort(
    (a, b) => Number(a.numero) - Number(b.numero),
  );

  if (cantidadHoyos === 18) {
    return hoyos.filter(
      (hoyo) => Number(hoyo.numero) >= 1 && Number(hoyo.numero) <= 18,
    );
  }

  if (recorrido === "vuelta") {
    return hoyos.filter(
      (hoyo) => Number(hoyo.numero) >= 10 && Number(hoyo.numero) <= 18,
    );
  }

  return hoyos.filter(
    (hoyo) => Number(hoyo.numero) >= 1 && Number(hoyo.numero) <= 9,
  );
}

/* =====================================================
   RESUMEN FINAL
===================================================== */

function actualizarResumenFinalPartida() {
  const club = obtenerClubSeleccionadoPartida();
  const campo = obtenerCampoSeleccionadoPartida();

  if (club && campo) {
    resumenClubCampoPartida.textContent = `${club.nombre} · ${campo.nombre}`;
  } else if (club) {
    resumenClubCampoPartida.textContent = `${club.nombre} · Sin campo`;
  } else {
    resumenClubCampoPartida.textContent = "Sin seleccionar";
  }

  const cantidad = jugadoresSeleccionadosPartida.length;

  resumenJugadoresPartida.textContent =
    cantidad === 1 ? "1 jugador" : `${cantidad} jugadores`;

  const hoyos = obtenerCantidadHoyosSeleccionada();

  if (hoyos === 18) {
    resumenRecorridoPartida.textContent = "18 hoyos";
  } else {
    resumenRecorridoPartida.textContent =
      recorridoPartidaInput.value === "vuelta"
        ? "9 hoyos · Segunda vuelta"
        : "9 hoyos · Primera vuelta";
  }
}

/* =====================================================
   ERRORES Y NOTIFICACIONES
===================================================== */

function mostrarErrorPartida(mensaje) {
  mensajeErrorPartida.textContent = mensaje;

  mensajeErrorPartida.classList.remove("oculto");

  mensajeErrorPartida.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function ocultarErrorPartida() {
  mensajeErrorPartida.textContent = "";

  mensajeErrorPartida.classList.add("oculto");
}

let temporizadorNotificacionPartida = null;

function mostrarNotificacionPartida(mensaje) {
  notificacionPartida.textContent = mensaje;

  notificacionPartida.classList.remove("oculto");

  clearTimeout(temporizadorNotificacionPartida);

  temporizadorNotificacionPartida = setTimeout(() => {
    notificacionPartida.classList.add("oculto");
  }, 2500);
}

/* =====================================================
   UTILIDADES
===================================================== */

function obtenerInicialesPartida(nombre) {
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

function escaparTextoPartida(valor) {
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

clubPartidaInput?.addEventListener("change", () => {
  llenarCamposPartida(clubPartidaInput.value);

  campoPartidaInput.value = "";

  mostrarDatosCampoPartida();
});

campoPartidaInput?.addEventListener("change", mostrarDatosCampoPartida);

document.querySelectorAll('input[name="cantidadHoyos"]').forEach((radio) => {
  radio.addEventListener("change", mostrarOcultarRecorrido9);
});

recorridoPartidaInput?.addEventListener(
  "change",
  actualizarResumenFinalPartida,
);

buscarJugadorPartidaInput?.addEventListener("input", () => {
  mostrarJugadoresDisponibles(buscarJugadorPartidaInput.value);
});

listaJugadoresPartida?.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-jugador-id]");

  if (!boton) {
    return;
  }

  alternarJugadorPartida(boton.dataset.jugadorId);
});

listaJugadoresElegidos?.addEventListener("click", (evento) => {
  const boton = evento.target.closest('[data-accion="quitar"]');

  if (!boton) {
    return;
  }

  quitarJugadorPartida(boton.dataset.jugadorId);
});

listaJugadoresElegidos?.addEventListener("change", (evento) => {
  if (evento.target.classList.contains("selectSalidaPartida")) {
    cambiarSalidaJugador(evento.target.dataset.jugadorId, evento.target.value);
  }

  if (evento.target.name === "organizadorPartida") {
    cambiarOrganizador(evento.target.value);
  }
});

formularioNuevaPartida?.addEventListener("submit", crearNuevaPartida);

btnIrMarcador?.addEventListener("click", () => {
  if (!partidaCreadaId) {
    return;
  }

  window.location.href = "index.html";
});

/* =====================================================
   INICIAR
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  colocarFechaHoraActual();
  llenarClubesPartida();
  mostrarJugadoresDisponibles();
  mostrarOcultarRecorrido9();
  actualizarResumenFinalPartida();
});
