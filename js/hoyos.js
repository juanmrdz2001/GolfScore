/* =====================================================
   CLAVES DE ALMACENAMIENTO
===================================================== */

const CLAVE_CLUB_HOYOS = "golfScoreClubSeleccionado";

const CLAVE_CAMPO_HOYOS = "golfScoreCampoSeleccionado";

/* =====================================================
   DATOS ACTUALES
===================================================== */

const clubHoyosId = localStorage.getItem(CLAVE_CLUB_HOYOS);

const campoHoyosId = localStorage.getItem(CLAVE_CAMPO_HOYOS);

let numeroHoyoActual = 1;

/* =====================================================
   ELEMENTOS
===================================================== */

const tituloPaginaHoyos = document.getElementById("tituloPaginaHoyos");

const nombreClubHoyos = document.getElementById("nombreClubHoyos");

const nombreCampoHoyos = document.getElementById("nombreCampoHoyos");

const hoyosConfigurados = document.getElementById("hoyosConfigurados");

const cantidadTotalHoyos = document.getElementById("cantidadTotalHoyos");

const parTotalCampo = document.getElementById("parTotalCampo");

const cantidadSalidasHoyos = document.getElementById("cantidadSalidasHoyos");

const indicadorHoyoActual = document.getElementById("indicadorHoyoActual");

const listaBotonesHoyos = document.getElementById("listaBotonesHoyos");

const formularioHoyo = document.getElementById("formularioHoyo");

const numeroHoyoConfigurado = document.getElementById("numeroHoyoConfigurado");

const numeroHoyoVisible = document.getElementById("numeroHoyoVisible");

const parHoyoInput = document.getElementById("parHoyoInput");

const contenedorSalidasHoyo = document.getElementById("contenedorSalidasHoyo");

const mensajeSinSalidasHoyo = document.getElementById("mensajeSinSalidasHoyo");

const mensajeErrorHoyo = document.getElementById("mensajeErrorHoyo");

const btnHoyoAnteriorConfiguracion = document.getElementById(
  "btnHoyoAnteriorConfiguracion",
);

const btnHoyoSiguienteConfiguracion = document.getElementById(
  "btnHoyoSiguienteConfiguracion",
);

const tablaResumenHoyos = document.getElementById("tablaResumenHoyos");

const notificacionHoyo = document.getElementById("notificacionHoyo");

/* =====================================================
   OBTENER CLUB Y CAMPO
===================================================== */

function obtenerDatosCampoHoyos() {
  const clubes = obtenerClubes();

  const club = clubes.find((clubActual) => clubActual.id === clubHoyosId);

  if (!club) {
    return {
      clubes,
      club: null,
      campo: null,
    };
  }

  const campo = Array.isArray(club.campos)
    ? club.campos.find((campoActual) => campoActual.id === campoHoyosId)
    : null;

  return {
    clubes,
    club,
    campo,
  };
}

/* =====================================================
   INICIAR INFORMACIÓN
===================================================== */

function mostrarInformacionCampoHoyos() {
  const { club, campo } = obtenerDatosCampoHoyos();

  if (!club || !campo) {
    window.location.href = "administrar-club.html";

    return false;
  }

  if (!Array.isArray(campo.hoyos)) {
    campo.hoyos = [];
  }

  if (!Array.isArray(campo.salidas)) {
    campo.salidas = [];
  }

  tituloPaginaHoyos.textContent = `🕳️ ${campo.nombre}`;

  nombreClubHoyos.textContent = club.nombre;

  nombreCampoHoyos.textContent = campo.nombre;

  cantidadTotalHoyos.textContent = campo.totalHoyos || 18;

  cantidadSalidasHoyos.textContent = campo.salidas.length;

  return true;
}

/* =====================================================
   CREAR BOTONES DE HOYOS
===================================================== */

function crearBotonesHoyos() {
  const { campo } = obtenerDatosCampoHoyos();

  if (!campo) {
    return;
  }

  const totalHoyos = Number(campo.totalHoyos || 18);

  listaBotonesHoyos.innerHTML = "";

  for (let numero = 1; numero <= totalHoyos; numero++) {
    const hoyoGuardado = campo.hoyos.find(
      (hoyo) => Number(hoyo.numero) === numero,
    );

    const boton = document.createElement("button");

    boton.type = "button";
    boton.className = "botonConfigurarHoyo";
    boton.dataset.numero = numero;
    boton.textContent = numero;

    if (hoyoGuardado) {
      boton.classList.add("hoyoGuardado");
    }

    if (numero === numeroHoyoActual) {
      boton.classList.add("hoyoSeleccionado");
    }

    listaBotonesHoyos.appendChild(boton);
  }
}

/* =====================================================
   CREAR CAMPOS POR SALIDA
===================================================== */

function crearCamposSalidasHoyo() {
  const { campo } = obtenerDatosCampoHoyos();

  if (!campo) {
    return;
  }

  contenedorSalidasHoyo.innerHTML = "";

  if (campo.salidas.length === 0) {
    mensajeSinSalidasHoyo.classList.remove("oculto");

    return;
  }

  mensajeSinSalidasHoyo.classList.add("oculto");

  campo.salidas.forEach((salida) => {
    const tarjeta = document.createElement("article");

    tarjeta.className = "tarjetaSalidaHoyo";

    tarjeta.innerHTML = `
      <div class="encabezadoSalidaHoyo">

        <span
          class="muestraColorSalida color-${escaparHTML(salida.color)}"
        ></span>

        <div>
          <span>Salida</span>

          <strong>
            ${escaparHTML(salida.nombre)}
          </strong>
        </div>

      </div>

      <div class="camposSalidaHoyo">

        <div class="grupoDatoSalidaHoyo">

          <label
            for="distancia-${salida.id}"
          >
            Distancia
          </label>

          <div class="inputConUnidad">

            <input
              id="distancia-${salida.id}"
              class="inputDistanciaHoyo"
              data-salida-id="${salida.id}"
              type="number"
              min="1"
              max="1000"
              step="1"
              inputmode="numeric"
              placeholder="385"
              required
            >

            <span>yd</span>

          </div>

        </div>


        <div class="grupoDatoSalidaHoyo">

          <label
            for="ventaja-${salida.id}"
          >
            Ventaja
          </label>

          <input
            id="ventaja-${salida.id}"
            class="inputVentajaHoyo"
            data-salida-id="${salida.id}"
            type="number"
            min="1"
            max="${campo.totalHoyos}"
            step="1"
            inputmode="numeric"
            placeholder="1-${campo.totalHoyos}"
            required
          >

        </div>

      </div>
    `;

    contenedorSalidasHoyo.appendChild(tarjeta);
  });
}

/* =====================================================
   CARGAR HOYO
===================================================== */

function cargarHoyo(numero) {
  const { campo } = obtenerDatosCampoHoyos();

  if (!campo) {
    return;
  }

  const totalHoyos = Number(campo.totalHoyos || 18);

  if (numero < 1 || numero > totalHoyos) {
    return;
  }

  numeroHoyoActual = numero;

  numeroHoyoConfigurado.value = String(numero);

  numeroHoyoVisible.textContent = numero;

  indicadorHoyoActual.textContent = `Hoyo ${numero}`;

  parHoyoInput.value = "";

  document.querySelectorAll(".inputDistanciaHoyo").forEach((input) => {
    input.value = "";
  });

  document.querySelectorAll(".inputVentajaHoyo").forEach((input) => {
    input.value = "";
  });

  const hoyo = campo.hoyos.find(
    (hoyoActual) => Number(hoyoActual.numero) === numero,
  );

  if (hoyo) {
    parHoyoInput.value = String(hoyo.par || "");

    campo.salidas.forEach((salida) => {
      const datosSalida = hoyo.salidas?.[salida.id];

      const inputDistancia = document.getElementById(`distancia-${salida.id}`);

      const inputVentaja = document.getElementById(`ventaja-${salida.id}`);

      if (inputDistancia) {
        inputDistancia.value = datosSalida?.distancia ?? "";
      }

      if (inputVentaja) {
        inputVentaja.value = datosSalida?.ventaja ?? "";
      }
    });
  }

  ocultarErrorHoyo();
  crearBotonesHoyos();
  actualizarBotonesNavegacion();
}

/* =====================================================
   VALIDAR VENTAJA DUPLICADA
===================================================== */

function ventajaYaUtilizada(campo, salidaId, ventaja, numeroHoyo) {
  return campo.hoyos.some((hoyo) => {
    if (Number(hoyo.numero) === Number(numeroHoyo)) {
      return false;
    }

    return Number(hoyo.salidas?.[salidaId]?.ventaja) === Number(ventaja);
  });
}

/* =====================================================
   GUARDAR HOYO
===================================================== */

function guardarHoyo(evento) {
  evento.preventDefault();

  const { clubes, campo } = obtenerDatosCampoHoyos();

  if (!campo) {
    mostrarErrorHoyo("No se encontró el campo.");

    return;
  }

  if (campo.salidas.length === 0) {
    mostrarErrorHoyo("Primero registra las salidas del campo.");

    return;
  }

  const numeroHoyo = Number(numeroHoyoConfigurado.value);

  const par = Number(parHoyoInput.value);

  if (!par || par < 3 || par > 6) {
    mostrarErrorHoyo("Selecciona un par válido.");

    parHoyoInput.focus();
    return;
  }

  const datosSalidas = {};

  for (const salida of campo.salidas) {
    const distanciaInput = document.getElementById(`distancia-${salida.id}`);

    const ventajaInput = document.getElementById(`ventaja-${salida.id}`);

    const distancia = Number(distanciaInput?.value);

    const ventaja = Number(ventajaInput?.value);

    if (!distancia || distancia < 1) {
      mostrarErrorHoyo(`Escribe la distancia de la salida ${salida.nombre}.`);

      distanciaInput?.focus();
      return;
    }

    if (!ventaja || ventaja < 1 || ventaja > Number(campo.totalHoyos)) {
      mostrarErrorHoyo(
        `La ventaja de ${salida.nombre} debe estar entre 1 y ${campo.totalHoyos}.`,
      );

      ventajaInput?.focus();
      return;
    }

    if (ventajaYaUtilizada(campo, salida.id, ventaja, numeroHoyo)) {
      mostrarErrorHoyo(
        `La ventaja ${ventaja} de la salida ${salida.nombre} ya está asignada a otro hoyo.`,
      );

      ventajaInput?.focus();
      return;
    }

    datosSalidas[salida.id] = {
      distancia,
      ventaja,
    };
  }

  const indiceHoyo = campo.hoyos.findIndex(
    (hoyo) => Number(hoyo.numero) === numeroHoyo,
  );

  const datosHoyo = {
    numero: numeroHoyo,
    par,
    salidas: datosSalidas,
    fechaActualizacion: new Date().toISOString(),
  };

  if (indiceHoyo >= 0) {
    campo.hoyos[indiceHoyo] = {
      ...campo.hoyos[indiceHoyo],
      ...datosHoyo,
    };
  } else {
    campo.hoyos.push({
      id: crearId("hoyo"),
      ...datosHoyo,
      fechaCreacion: new Date().toISOString(),
    });
  }

  campo.hoyos.sort((a, b) => Number(a.numero) - Number(b.numero));

  guardarClubes(clubes);

  ocultarErrorHoyo();

  actualizarResumenHoyos();
  crearBotonesHoyos();
  mostrarTablaResumenHoyos();

  mostrarNotificacionHoyo(`Hoyo ${numeroHoyo} guardado correctamente.`);

  if (numeroHoyo < Number(campo.totalHoyos)) {
    cargarHoyo(numeroHoyo + 1);
  }
}

/* =====================================================
   RESUMEN
===================================================== */

function actualizarResumenHoyos() {
  const { campo } = obtenerDatosCampoHoyos();

  if (!campo) {
    return;
  }

  hoyosConfigurados.textContent = campo.hoyos.length;

  const parTotal = campo.hoyos.reduce(
    (total, hoyo) => total + Number(hoyo.par || 0),
    0,
  );

  parTotalCampo.textContent = parTotal;
}

/* =====================================================
   TABLA DE HOYOS
===================================================== */

function mostrarTablaResumenHoyos() {
  const { campo } = obtenerDatosCampoHoyos();

  if (!campo) {
    return;
  }

  tablaResumenHoyos.innerHTML = "";

  if (campo.hoyos.length === 0) {
    tablaResumenHoyos.innerHTML = `
      <p class="mensajeTablaVacia">
        Todavía no hay hoyos guardados.
      </p>
    `;

    return;
  }

  const encabezadoSalidas = campo.salidas
    .map(
      (salida) => `
        <span>
          ${escaparHTML(salida.nombre)}
        </span>
      `,
    )
    .join("");

  const encabezado = document.createElement("div");

  encabezado.className = "filaResumenHoyo encabezadoResumenHoyo";

  encabezado.style.setProperty("--columnas-salidas", campo.salidas.length);

  encabezado.innerHTML = `
    <span>Hoyo</span>
    <span>Par</span>
    ${encabezadoSalidas}
  `;

  tablaResumenHoyos.appendChild(encabezado);

  campo.hoyos.forEach((hoyo) => {
    const datosSalidas = campo.salidas
      .map((salida) => {
        const datos = hoyo.salidas?.[salida.id];

        return `
          <span class="datoResumenSalida">
            <strong>
              ${datos?.distancia || "-"}
            </strong>

            <small>
              V${datos?.ventaja || "-"}
            </small>
          </span>
        `;
      })
      .join("");

    const fila = document.createElement("button");

    fila.type = "button";
    fila.className = "filaResumenHoyo";
    fila.dataset.numero = hoyo.numero;

    fila.style.setProperty("--columnas-salidas", campo.salidas.length);

    fila.innerHTML = `
      <strong>${hoyo.numero}</strong>
      <span>${hoyo.par}</span>
      ${datosSalidas}
    `;

    tablaResumenHoyos.appendChild(fila);
  });
}

/* =====================================================
   NAVEGACIÓN
===================================================== */

function actualizarBotonesNavegacion() {
  const { campo } = obtenerDatosCampoHoyos();

  if (!campo) {
    return;
  }

  btnHoyoAnteriorConfiguracion.disabled = numeroHoyoActual <= 1;

  btnHoyoSiguienteConfiguracion.disabled =
    numeroHoyoActual >= Number(campo.totalHoyos);
}

function irHoyoAnterior() {
  cargarHoyo(numeroHoyoActual - 1);
}

function irHoyoSiguiente() {
  cargarHoyo(numeroHoyoActual + 1);
}

/* =====================================================
   ERRORES Y NOTIFICACIONES
===================================================== */

function mostrarErrorHoyo(mensaje) {
  mensajeErrorHoyo.textContent = mensaje;

  mensajeErrorHoyo.classList.remove("oculto");
}

function ocultarErrorHoyo() {
  mensajeErrorHoyo.textContent = "";

  mensajeErrorHoyo.classList.add("oculto");
}

let temporizadorNotificacionHoyo = null;

function mostrarNotificacionHoyo(mensaje) {
  notificacionHoyo.textContent = mensaje;

  notificacionHoyo.classList.remove("oculto");

  clearTimeout(temporizadorNotificacionHoyo);

  temporizadorNotificacionHoyo = setTimeout(() => {
    notificacionHoyo.classList.add("oculto");
  }, 2400);
}

/* =====================================================
   EVENTOS
===================================================== */

formularioHoyo?.addEventListener("submit", guardarHoyo);

btnHoyoAnteriorConfiguracion?.addEventListener("click", irHoyoAnterior);

btnHoyoSiguienteConfiguracion?.addEventListener("click", irHoyoSiguiente);

listaBotonesHoyos?.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".botonConfigurarHoyo");

  if (!boton) {
    return;
  }

  cargarHoyo(Number(boton.dataset.numero));
});

tablaResumenHoyos?.addEventListener("click", (evento) => {
  const fila = evento.target.closest(".filaResumenHoyo[data-numero]");

  if (!fila) {
    return;
  }

  cargarHoyo(Number(fila.dataset.numero));

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* =====================================================
   INICIAR
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const campoValido = mostrarInformacionCampoHoyos();

  if (!campoValido) {
    return;
  }

  crearCamposSalidasHoyo();
  crearBotonesHoyos();
  actualizarResumenHoyos();
  mostrarTablaResumenHoyos();
  cargarHoyo(1);
});
