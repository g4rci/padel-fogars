import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";


const config = {
  apiKey: process.env.REACT_APP_FIREBASEKEY,
  authDomain: "padelfogarsdelaselva.firebaseapp.com",
  databaseURL: "https://padelfogarsdelaselva-default-rtdb.firebaseio.com",
  projectId: "padelfogarsdelaselva",
  storageBucket: "padelfogarsdelaselva.appspot.com",
  messagingSenderId: "569906249912",
  appId: "1:569906249912:web:4ffd85b49a25401397344d",
  measurementId: "G-VC3GTZHV0B"
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();


