/* =====================================================
   CLAVES
===================================================== */

const CLAVE_PARTIDAS = "golfScorePartidas";
const CLAVE_PARTIDA_ACTUAL = "golfScorePartidaActual";

/* =====================================================
   ESTADO
===================================================== */

let filtroEstadoPartida = "todas";
let partidaPendienteEliminarId = null;
let partidaDetalleActual = null;

/* =====================================================
   ELEMENTOS
===================================================== */

const totalPartidasElemento = document.getElementById("totalPartidas");

const partidasEnCursoElemento = document.getElementById("partidasEnCurso");

const partidasFinalizadasElemento = document.getElementById(
  "partidasFinalizadas",
);

const buscarPartidaInput = document.getElementById("buscarPartida");

const listaPartidasElemento = document.getElementById("listaPartidas");

const mensajeSinPartidas = document.getElementById("mensajeSinPartidas");

const modalEliminarPartida = document.getElementById("modalEliminarPartida");

const mensajeEliminarPartida = document.getElementById(
  "mensajeEliminarPartida",
);

const btnCancelarEliminarPartida = document.getElementById(
  "btnCancelarEliminarPartida",
);

const btnConfirmarEliminarPartida = document.getElementById(
  "btnConfirmarEliminarPartida",
);

const notificacionPartidas = document.getElementById("notificacionPartidas");

const modalDetallePartida = document.getElementById("modalDetallePartida");

const tituloDetallePartida = document.getElementById("tituloDetallePartida");

const campoDetallePartida = document.getElementById("campoDetallePartida");

const fechaDetallePartida = document.getElementById("fechaDetallePartida");

const estadoDetallePartida = document.getElementById("estadoDetallePartida");

const hoyosDetallePartida = document.getElementById("hoyosDetallePartida");

const progresoDetallePartida = document.getElementById(
  "progresoDetallePartida",
);

const encabezadoTablaDetallePartida = document.getElementById(
  "encabezadoTablaDetallePartida",
);

const cuerpoTablaDetallePartida = document.getElementById(
  "cuerpoTablaDetallePartida",
);

const btnCerrarDetallePartida = document.getElementById(
  "btnCerrarDetallePartida",
);

const btnCerrarDetalleInferior = document.getElementById(
  "btnCerrarDetalleInferior",
);

const btnCompartirDetallePartida = document.getElementById(
  "btnCompartirDetallePartida",
);

/* =====================================================
   LEER Y GUARDAR
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
   ESTADÍSTICAS
===================================================== */

function actualizarResumenPartidas() {
  const partidas = obtenerPartidas();

  const enCurso = partidas.filter(
    (partida) => normalizarEstadoPartida(partida.estado) === "en_curso",
  ).length;

  const finalizadas = partidas.filter(
    (partida) => normalizarEstadoPartida(partida.estado) === "finalizada",
  ).length;

  totalPartidasElemento.textContent = partidas.length;

  partidasEnCursoElemento.textContent = enCurso;

  partidasFinalizadasElemento.textContent = finalizadas;
}

/* =====================================================
   MOSTRAR LISTA
===================================================== */

function mostrarPartidas() {
  const partidas = obtenerPartidas();

  const textoBusqueda = buscarPartidaInput.value.trim().toLowerCase();

  const partidasFiltradas = partidas
    .filter((partida) => {
      const estado = normalizarEstadoPartida(partida.estado);

      const coincideEstado =
        filtroEstadoPartida === "todas" || estado === filtroEstadoPartida;

      const textoPartida = `
        ${partida.nombre || ""}
        ${partida.clubNombre || ""}
        ${partida.campoNombre || ""}
        ${partida.fecha || ""}
      `.toLowerCase();

      const coincideBusqueda = textoPartida.includes(textoBusqueda);

      return coincideEstado && coincideBusqueda;
    })
    .sort((a, b) => {
      const fechaA = crearFechaPartida(a);
      const fechaB = crearFechaPartida(b);

      return fechaB - fechaA;
    });

  listaPartidasElemento.innerHTML = "";

  if (partidasFiltradas.length === 0) {
    mensajeSinPartidas.classList.remove("oculto");

    return;
  }

  mensajeSinPartidas.classList.add("oculto");

  partidasFiltradas.forEach((partida) => {
    listaPartidasElemento.appendChild(crearTarjetaPartida(partida));
  });
}

/* =====================================================
   CREAR TARJETA
===================================================== */

function crearTarjetaPartida(partida) {
  const tarjeta = document.createElement("article");

  tarjeta.className = "tarjetaPartidaGuardada";

  const estado = normalizarEstadoPartida(partida.estado);

  const jugadores = Array.isArray(partida.jugadores) ? partida.jugadores : [];

  const hoyos = Array.isArray(partida.hoyos) ? partida.hoyos : [];

  const progreso = calcularProgresoPartida(partida);

  const nombresJugadores = jugadores
    .map((jugador) => jugador.alias || jugador.nombre || "Jugador")
    .join(", ");

  const textoEstado = estado === "finalizada" ? "Finalizada" : "En curso";

  const claseEstado =
    estado === "finalizada" ? "estadoFinalizada" : "estadoEnCurso";

  const botonPrincipal =
    estado === "finalizada"
      ? ""
      : `
        <button
          class="btnAccionPartida btnContinuarPartida"
          type="button"
          data-accion="continuar"
          data-partida-id="${partida.id}"
        >
          ▶ Continuar partida
        </button>
      `;

  tarjeta.innerHTML = `
    <div class="cabeceraPartidaGuardada">

      <div class="datosPrincipalesPartida">

        <span class="etiquetaEstadoPartida ${claseEstado}">
          ${textoEstado}
        </span>

        <h2>
          ${escaparHTML(partida.nombre || "Partida sin nombre")}
        </h2>

        <p>
          ${escaparHTML(partida.clubNombre || "Sin club")}
          ·
          ${escaparHTML(partida.campoNombre || "Sin campo")}
        </p>

      </div>

      <button
        class="btnEliminarPartidaTarjeta"
        type="button"
        data-accion="eliminar"
        data-partida-id="${partida.id}"
        aria-label="Eliminar partida"
      >
        🗑️
      </button>

    </div>


    <div class="datosPartidaGuardada">

      <div>
        <span>Fecha</span>
        <strong>
          ${formatearFecha(partida.fecha)}
        </strong>
      </div>

      <div>
        <span>Hora</span>
        <strong>
          ${escaparHTML(partida.hora || "--:--")}
        </strong>
      </div>

      <div>
        <span>Jugadores</span>
        <strong>
          ${jugadores.length}
        </strong>
      </div>

      <div>
        <span>Hoyos</span>
        <strong>
          ${partida.cantidadHoyos || hoyos.length}
        </strong>
      </div>

    </div>


    <div class="jugadoresPartidaGuardada">

      <span>
        🏌️
      </span>

      <p>
        ${escaparHTML(nombresJugadores || "Sin jugadores")}
      </p>

    </div>


    <div class="progresoPartidaGuardada">

      <div class="textoProgresoPartida">

        <span>Progreso de captura</span>

        <strong>
          ${progreso.porcentaje}%
        </strong>

      </div>

      <div class="barraProgresoPartida">
        <div
          class="rellenoProgresoPartida"
          style="width: ${progreso.porcentaje}%"
        ></div>
      </div>

      <small>
        ${progreso.capturados}
        de
        ${progreso.total}
        resultados capturados
      </small>

    </div>

    <div class="accionesPartidaGuardada">

  ${botonPrincipal}

  <button
    class="btnAccionPartida btnDetallePartida"
    type="button"
    data-accion="detalle"
    data-partida-id="${partida.id}"
  >
    👁 Ver detalle
  </button>

</div>
  `;

  return tarjeta;
}

/* =====================================================
   PROGRESO
===================================================== */

function calcularProgresoPartida(partida) {
  const jugadores = Array.isArray(partida.jugadores) ? partida.jugadores : [];

  const hoyos = Array.isArray(partida.hoyos) ? partida.hoyos : [];

  const total = jugadores.length * hoyos.length;

  let capturados = 0;

  jugadores.forEach((jugador) => {
    const scores =
      jugador.scores && typeof jugador.scores === "object"
        ? jugador.scores
        : {};

    hoyos.forEach((hoyo) => {
      const score = Number(scores[hoyo.numero]);

      if (score > 0) {
        capturados++;
      }
    });
  });

  const porcentaje = total > 0 ? Math.round((capturados / total) * 100) : 0;

  return {
    total,
    capturados,
    porcentaje,
  };
}

/* =====================================================
   CONTINUAR PARTIDA
===================================================== */

function continuarPartida(partidaId) {
  const partidas = obtenerPartidas();

  const partida = partidas.find(
    (partidaActual) => partidaActual.id === partidaId,
  );

  if (!partida) {
    mostrarNotificacionPartidas("No se encontró la partida.");

    return;
  }

  localStorage.setItem(CLAVE_PARTIDA_ACTUAL, partida.id);

  window.location.href = "index.html";
}

/* =====================================================
   VER RESULTADOS
===================================================== */

function verResultadosPartida(partidaId) {
  localStorage.setItem(CLAVE_PARTIDA_ACTUAL, partidaId);

  window.location.href = `resultados.html?id=${encodeURIComponent(partidaId)}`;
}

/* =====================================================
   VER DETALLE
===================================================== */

function verDetallePartida(partidaId) {
  const partidas = obtenerPartidas();

  const partida = partidas.find(
    (partidaActual) => partidaActual.id === partidaId,
  );

  if (!partida) {
    mostrarNotificacionPartidas("No se encontró la partida.");

    return;
  }

  partidaDetalleActual = partida;

  const jugadores = Array.isArray(partida.jugadores) ? partida.jugadores : [];

  const hoyos = Array.isArray(partida.hoyos)
    ? [...partida.hoyos].sort((a, b) => Number(a.numero) - Number(b.numero))
    : [];

  const progreso = calcularProgresoPartida(partida);

  tituloDetallePartida.textContent = partida.nombre || "Partida sin nombre";

  campoDetallePartida.textContent = `${partida.clubNombre || "Sin club"} · ${
    partida.campoNombre || "Sin campo"
  }`;

  fechaDetallePartida.textContent = formatearFecha(partida.fecha);

  estadoDetallePartida.textContent =
    normalizarEstadoPartida(partida.estado) === "finalizada"
      ? "Finalizada"
      : "En curso";

  hoyosDetallePartida.textContent = `${hoyos.length} hoyos`;

  progresoDetallePartida.textContent = `${progreso.porcentaje}%`;

  crearEncabezadoDetalle(hoyos);
  crearCuerpoDetalle(jugadores, hoyos);

  modalDetallePartida.classList.remove("oculto");
}

function crearEncabezadoDetalle(hoyos) {
  encabezadoTablaDetallePartida.innerHTML = "";

  const filaEncabezado = document.createElement("tr");

  let columnasHoyos = "";

  hoyos.forEach((hoyo) => {
    columnasHoyos += `
      <th>
        ${hoyo.numero}
      </th>
    `;
  });

  filaEncabezado.innerHTML = `
    <th class="columnaFijaJugadorDetalle">
      Jugador
    </th>

    ${columnasHoyos}

    <th>Ida</th>
    <th>Vuelta</th>
    <th>Total</th>
    <th>Par</th>
    <th>+/-</th>
  `;

  encabezadoTablaDetallePartida.appendChild(filaEncabezado);

  const filaPar = document.createElement("tr");

  let columnasPar = "";

  hoyos.forEach((hoyo) => {
    columnasPar += `
      <th class="filaParDetalle">
        ${Number(hoyo.par || 0)}
      </th>
    `;
  });

  const parIda = calcularParRango(hoyos, 1, 9);

  const parVuelta = calcularParRango(hoyos, 10, 18);

  const parTotal = hoyos.reduce(
    (total, hoyo) => total + Number(hoyo.par || 0),
    0,
  );

  filaPar.innerHTML = `
    <th class="columnaFijaJugadorDetalle filaParDetalle">
      Par
    </th>

    ${columnasPar}

    <th class="filaParDetalle">
      ${parIda}
    </th>

    <th class="filaParDetalle">
      ${parVuelta}
    </th>

    <th class="filaParDetalle">
      ${parTotal}
    </th>

    <th class="filaParDetalle">
      ${parTotal}
    </th>

    <th class="filaParDetalle">
      0
    </th>
  `;

  encabezadoTablaDetallePartida.appendChild(filaPar);
}

function crearCuerpoDetalle(jugadores, hoyos) {
  cuerpoTablaDetallePartida.innerHTML = "";

  if (jugadores.length === 0) {
    cuerpoTablaDetallePartida.innerHTML = `
      <tr>
        <td colspan="${hoyos.length + 6}">
          No hay jugadores en esta partida.
        </td>
      </tr>
    `;

    return;
  }

  jugadores.forEach((jugador) => {
    const fila = document.createElement("tr");

    const scores =
      jugador.scores && typeof jugador.scores === "object"
        ? jugador.scores
        : {};

    let columnasScores = "";

    hoyos.forEach((hoyo) => {
      const score = Number(scores[hoyo.numero] || 0);

      const par = Number(hoyo.par || 0);

      const claseResultado = obtenerClaseResultadoHoyo(score, par);

      columnasScores += `
        <td class="${claseResultado}">
          ${score > 0 ? score : "-"}
        </td>
      `;
    });

    const ida = calcularTotalRango(jugador, hoyos, 1, 9);

    const vuelta = calcularTotalRango(jugador, hoyos, 10, 18);

    const total = ida + vuelta;

    const parTotal = hoyos.reduce(
      (suma, hoyo) => suma + Number(hoyo.par || 0),
      0,
    );

    const diferencia = total > 0 ? total - parTotal : 0;

    fila.innerHTML = `
      <td class="columnaFijaJugadorDetalle">

        <strong>
          ${escaparHTML(jugador.alias || jugador.nombre || "Jugador")}
        </strong>

        <small>
          ${escaparHTML(jugador.salidaNombre || "")}
        </small>

      </td>

      ${columnasScores}

      <td>
        ${ida || "-"}
      </td>

      <td>
        ${vuelta || "-"}
      </td>

      <td class="totalJugadorDetalle">
        ${total || "-"}
      </td>

      <td>
        ${parTotal}
      </td>

      <td class="${
        diferencia < 0
          ? "resultadoBajoPar"
          : diferencia > 0
            ? "resultadoSobrePar"
            : "resultadoPar"
      }">
        ${formatearDiferencia(diferencia, total)}
      </td>
    `;

    cuerpoTablaDetallePartida.appendChild(fila);
  });
}

/* =====================================================
   TOTAL POR JUGADOR
===================================================== */

function calcularTotalJugadorPartida(jugador, hoyos) {
  const listaHoyos = Array.isArray(hoyos) ? hoyos : [];

  const scores =
    jugador.scores && typeof jugador.scores === "object" ? jugador.scores : {};

  return listaHoyos.reduce(
    (total, hoyo) => total + Number(scores[hoyo.numero] || 0),
    0,
  );
}

/* =====================================================
   ELIMINAR
===================================================== */

function abrirModalEliminarPartida(partidaId) {
  const partidas = obtenerPartidas();

  const partida = partidas.find(
    (partidaActual) => partidaActual.id === partidaId,
  );

  if (!partida) {
    return;
  }

  partidaPendienteEliminarId = partidaId;

  mensajeEliminarPartida.textContent = `¿Deseas eliminar la partida "${partida.nombre}"? Esta acción no se puede deshacer.`;

  modalEliminarPartida.classList.remove("oculto");
}

function cerrarModalEliminarPartida() {
  partidaPendienteEliminarId = null;

  modalEliminarPartida.classList.add("oculto");
}

function confirmarEliminarPartida() {
  if (!partidaPendienteEliminarId) {
    return;
  }

  const partidas = obtenerPartidas();

  const partidasActualizadas = partidas.filter(
    (partida) => partida.id !== partidaPendienteEliminarId,
  );

  guardarPartidas(partidasActualizadas);

  const partidaActivaId = localStorage.getItem(CLAVE_PARTIDA_ACTUAL);

  if (partidaActivaId === partidaPendienteEliminarId) {
    localStorage.removeItem(CLAVE_PARTIDA_ACTUAL);
  }

  cerrarModalEliminarPartida();

  actualizarResumenPartidas();
  mostrarPartidas();

  mostrarNotificacionPartidas("Partida eliminada correctamente.");
}

/* =====================================================
   ESTADO
===================================================== */

function normalizarEstadoPartida(estado) {
  if (estado === "finalizada" || estado === "terminada") {
    return "finalizada";
  }

  return "en_curso";
}

/* =====================================================
   FECHAS
===================================================== */

function crearFechaPartida(partida) {
  const fecha = partida.fecha || "";
  const hora = partida.hora || "00:00";

  const fechaCompleta = new Date(`${fecha}T${hora}`);

  if (Number.isNaN(fechaCompleta.getTime())) {
    return new Date(partida.fechaCreacion || 0);
  }

  return fechaCompleta;
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "Sin fecha";
  }

  const partes = fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  const [anio, mes, dia] = partes;

  return `${dia}/${mes}/${anio}`;
}

/* =====================================================
   NOTIFICACIÓN
===================================================== */

let temporizadorNotificacionPartidas = null;

function mostrarNotificacionPartidas(mensaje) {
  notificacionPartidas.textContent = mensaje;

  notificacionPartidas.classList.remove("oculto");

  clearTimeout(temporizadorNotificacionPartidas);

  temporizadorNotificacionPartidas = setTimeout(() => {
    notificacionPartidas.classList.add("oculto");
  }, 2500);
}

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
   EVENTOS
===================================================== */

buscarPartidaInput?.addEventListener("input", mostrarPartidas);

document.querySelectorAll(".btnFiltroPartida").forEach((boton) => {
  boton.addEventListener("click", () => {
    document.querySelectorAll(".btnFiltroPartida").forEach((otroBoton) => {
      otroBoton.classList.remove("activo");
    });

    boton.classList.add("activo");

    filtroEstadoPartida = boton.dataset.estado;

    mostrarPartidas();
  });
});

listaPartidasElemento?.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion]");

  if (!boton) {
    return;
  }

  const partidaId = boton.dataset.partidaId;

  const accion = boton.dataset.accion;

  if (accion === "continuar") {
    continuarPartida(partidaId);
  }

  if (accion === "resultados") {
    verResultadosPartida(partidaId);
  }

  if (accion === "detalle") {
    verDetallePartida(partidaId);
  }

  if (accion === "eliminar") {
    abrirModalEliminarPartida(partidaId);
  }
});

btnCancelarEliminarPartida?.addEventListener(
  "click",
  cerrarModalEliminarPartida,
);

btnConfirmarEliminarPartida?.addEventListener(
  "click",
  confirmarEliminarPartida,
);

modalEliminarPartida?.addEventListener("click", (evento) => {
  if (evento.target === modalEliminarPartida) {
    cerrarModalEliminarPartida();
  }
});

btnCompartirDetallePartida?.addEventListener("click", compartirDetallePartida);

/* =====================================================
   INICIAR
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  actualizarResumenPartidas();
  mostrarPartidas();
});

function calcularTotalRango(jugador, hoyos, desde, hasta) {
  const scores =
    jugador.scores && typeof jugador.scores === "object" ? jugador.scores : {};

  return hoyos.reduce((total, hoyo) => {
    const numero = Number(hoyo.numero);

    if (numero < desde || numero > hasta) {
      return total;
    }

    return total + Number(scores[hoyo.numero] || 0);
  }, 0);
}

function calcularParRango(hoyos, desde, hasta) {
  return hoyos.reduce((total, hoyo) => {
    const numero = Number(hoyo.numero);

    if (numero < desde || numero > hasta) {
      return total;
    }

    return total + Number(hoyo.par || 0);
  }, 0);
}

function obtenerClaseResultadoHoyo(score, par) {
  if (!score || !par) {
    return "";
  }

  const diferencia = score - par;

  if (diferencia <= -2) {
    return "resultadoEagle";
  }

  if (diferencia === -1) {
    return "resultadoBirdie";
  }

  if (diferencia === 0) {
    return "resultadoPar";
  }

  if (diferencia === 1) {
    return "resultadoBogey";
  }

  return "resultadoDobleBogey";
}

function formatearDiferencia(diferencia, total) {
  if (!total) {
    return "-";
  }

  if (diferencia === 0) {
    return "E";
  }

  if (diferencia > 0) {
    return `+${diferencia}`;
  }

  return diferencia;
}

function cerrarDetallePartida() {
  modalDetallePartida.classList.add("oculto");
}

btnCerrarDetallePartida?.addEventListener("click", cerrarDetallePartida);

btnCerrarDetalleInferior?.addEventListener("click", cerrarDetallePartida);

modalDetallePartida?.addEventListener("click", (evento) => {
  if (evento.target === modalDetallePartida) {
    cerrarDetallePartida();
  }
});

function crearTextoCompartirDetalle(partida) {
  const jugadores = Array.isArray(partida.jugadores) ? partida.jugadores : [];

  const hoyos = Array.isArray(partida.hoyos)
    ? [...partida.hoyos].sort((a, b) => Number(a.numero) - Number(b.numero))
    : [];

  const parTotal = hoyos.reduce(
    (total, hoyo) => total + Number(hoyo.par || 0),
    0,
  );

  const resultados = jugadores
    .map((jugador) => {
      const ida = calcularTotalRango(jugador, hoyos, 1, 9);

      const vuelta = calcularTotalRango(jugador, hoyos, 10, 18);

      const total = ida + vuelta;

      const diferencia = total > 0 ? total - parTotal : 0;

      const nombre = jugador.alias || jugador.nombre || "Jugador";

      return (
        `🏌️ ${nombre}\n` +
        `Ida: ${ida || "-"} | ` +
        `Vuelta: ${vuelta || "-"} | ` +
        `Total: ${total || "-"} | ` +
        `Resultado: ${formatearDiferencia(diferencia, total)}`
      );
    })
    .join("\n\n");

  return (
    `⛳ Golf Score\n\n` +
    `${partida.nombre || "Partida"}\n` +
    `${partida.clubNombre || "Sin club"} · ` +
    `${partida.campoNombre || "Sin campo"}\n` +
    `Fecha: ${formatearFecha(partida.fecha)}\n` +
    `Hoyos: ${hoyos.length}\n` +
    `Par del campo: ${parTotal}\n\n` +
    `${resultados}`
  );
}

async function compartirDetallePartida() {
  if (!partidaDetalleActual) {
    mostrarNotificacionPartidas("No hay un detalle abierto.");

    return;
  }

  const texto = crearTextoCompartirDetalle(partidaDetalleActual);

  try {
    if (navigator.share) {
      await navigator.share({
        title: partidaDetalleActual.nombre || "Golf Score",
        text: texto,
      });

      mostrarNotificacionPartidas("Detalle compartido.");

      return;
    }

    await navigator.clipboard.writeText(texto);

    mostrarNotificacionPartidas("Detalle copiado al portapapeles.");
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    copiarTextoAlternativo(texto);
  }
}

function copiarTextoAlternativo(texto) {
  const areaTexto = document.createElement("textarea");

  areaTexto.value = texto;
  areaTexto.style.position = "fixed";
  areaTexto.style.opacity = "0";

  document.body.appendChild(areaTexto);

  areaTexto.select();

  document.execCommand("copy");

  areaTexto.remove();

  mostrarNotificacionPartidas("Detalle copiado al portapapeles.");
}
