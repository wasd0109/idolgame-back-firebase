const firebase = require('firebase');
const functions = require('firebase-functions');

const firebaseConfig = require('./config');

function initializeFirebase() {
  firebase.initializeApp(firebaseConfig);
  firebase.auth().useEmulator('http://localhost:9099');
  firebase.functions().useEmulator('localhost', 5001);
  firebase.firestore().useEmulator('localhost', 8080);
}

module.exports = initializeFirebase;
