// ======================================================
// FIREBASE
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ======================================================
// CONFIGURACIÓN
// ======================================================

const firebaseConfig = {
  apiKey: "AIzaSyBU6-8P18GxpeLUJ676IUMX7B1PlC8zuAU",

  authDomain: "golfscore-web.firebaseapp.com",

  projectId: "golfscore-web",

  storageBucket: "golfscore-web.firebasestorage.app",

  messagingSenderId: "945306485685",

  appId: "1:945306485685:web:a579cfbf860846f8198ffc",
};

// ======================================================
// INICIALIZAR
// ======================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ======================================================
// EXPORTAR
// ======================================================

export { db };
