const firebase = require('firebase');
const { firebaseConfig } = require('./config');

exports.initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);
  firebase.auth().useEmulator('http://localhost:9099');
  firebase.functions().useEmulator('localhost', 5001);
  firebase.firestore().useEmulator('localhost', 8080);
};
