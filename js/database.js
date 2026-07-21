// ======================================================
// ACCESO A DATOS - FIRESTORE
// ======================================================

import { db } from "./firebase.js";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const COLECCION_CLUBES = "clubes";
const CLAVE_LOCAL_CLUBES = "golfScoreClubes";

// ======================================================
// NORMALIZAR CLUB
// ======================================================

function normalizarClub(club) {
  return {
    ...club,
    id: String(club.id),
    campos: Array.isArray(club.campos) ? club.campos : [],
  };
}

// ======================================================
// OBTENER TODOS LOS CLUBES
// ======================================================

export async function obtenerClubesDB() {
  const consulta = await getDocs(collection(db, COLECCION_CLUBES));

  let clubes = consulta.docs.map((documento) =>
    normalizarClub({
      id: documento.id,
      ...documento.data(),
    }),
  );

  // Si Firebase está vacío,
  // intenta migrar los clubes de localStorage.
  if (clubes.length === 0) {
    const cantidadMigrada = await migrarClubesLocalesAFirebase();

    if (cantidadMigrada > 0) {
      const nuevaConsulta = await getDocs(collection(db, COLECCION_CLUBES));

      clubes = nuevaConsulta.docs.map((documento) =>
        normalizarClub({
          id: documento.id,
          ...documento.data(),
        }),
      );
    }
  }

  return clubes.sort((a, b) =>
    String(a.nombre || "").localeCompare(String(b.nombre || ""), "es"),
  );
}

// ======================================================
// OBTENER UN CLUB
// ======================================================

export async function obtenerClubDB(clubId) {
  if (!clubId) {
    return null;
  }

  const referencia = doc(db, COLECCION_CLUBES, String(clubId));

  const resultado = await getDoc(referencia);

  if (!resultado.exists()) {
    return null;
  }

  return normalizarClub({
    id: resultado.id,
    ...resultado.data(),
  });
}

// ======================================================
// GUARDAR O ACTUALIZAR CLUB
// ======================================================

export async function guardarClubDB(club) {
  if (!club?.id) {
    throw new Error("El club no tiene identificador.");
  }

  const clubNormalizado = normalizarClub(club);

  const referencia = doc(db, COLECCION_CLUBES, clubNormalizado.id);

  const { id, ...datosClub } = clubNormalizado;

  await setDoc(referencia, datosClub, {
    merge: true,
  });

  guardarRespaldoLocalClub(clubNormalizado);

  return clubNormalizado;
}

// ======================================================
// ELIMINAR CLUB
// ======================================================

export async function eliminarClubDB(clubId) {
  if (!clubId) {
    throw new Error("No se recibió el identificador del club.");
  }

  await deleteDoc(doc(db, COLECCION_CLUBES, String(clubId)));

  const clubesLocales = leerClubesLocales().filter(
    (club) => String(club.id) !== String(clubId),
  );

  localStorage.setItem(CLAVE_LOCAL_CLUBES, JSON.stringify(clubesLocales));
}

// ======================================================
// MIGRAR CLUBES LOCALES A FIREBASE
// ======================================================

export async function migrarClubesLocalesAFirebase() {
  const clubesLocales = leerClubesLocales();

  if (clubesLocales.length === 0) {
    return 0;
  }

  await Promise.all(
    clubesLocales.map((club) => guardarClubDB(normalizarClub(club))),
  );

  return clubesLocales.length;
}

// ======================================================
// LEER RESPALDO LOCAL
// ======================================================

function leerClubesLocales() {
  const datos = localStorage.getItem(CLAVE_LOCAL_CLUBES);

  if (!datos) {
    return [];
  }

  try {
    const clubes = JSON.parse(datos);

    return Array.isArray(clubes) ? clubes : [];
  } catch (error) {
    console.error("No se pudo leer el respaldo local de clubes:", error);

    return [];
  }
}

// ======================================================
// GUARDAR RESPALDO LOCAL
// ======================================================

function guardarRespaldoLocalClub(clubGuardado) {
  const clubes = leerClubesLocales();

  const indice = clubes.findIndex(
    (club) => String(club.id) === String(clubGuardado.id),
  );

  if (indice >= 0) {
    clubes[indice] = clubGuardado;
  } else {
    clubes.push(clubGuardado);
  }

  localStorage.setItem(CLAVE_LOCAL_CLUBES, JSON.stringify(clubes));
}
