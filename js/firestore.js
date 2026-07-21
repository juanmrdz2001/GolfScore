import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

export async function probarFirebase() {
  try {
    const referencia = await addDoc(collection(db, "pruebas"), {
      mensaje: "Golf Score conectado",
      fecha: serverTimestamp(),
    });

    console.log("Firebase conectado correctamente:", referencia.id);

    return true;
  } catch (error) {
    console.error("Error al conectar con Firebase:", error);

    return false;
  }
}

export async function obtenerPruebas() {
  try {
    const consulta = await getDocs(collection(db, "pruebas"));

    return consulta.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));
  } catch (error) {
    console.error("Error al leer Firebase:", error);

    return [];
  }
}
