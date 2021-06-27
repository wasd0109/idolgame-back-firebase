const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const firebase = require('firebase');
const initializeFirebase = require('./firebaseInit');
const generatePlayer = require('./controllers/generatePlayer');

initializeFirebase();
admin.initializeApp();

const db = admin.firestore();

const isEmpty = (text) => {
  return text.trim().length === 0 ? true : false;
};

app.post('/register', (req, res) => {
  const { email, password, confirmPassword, playerName } = req.body;
  let error = {};
  console.log('abcs');
  if (isEmpty(email)) error.email = 'Must not be empty';
  if (isEmpty(password)) error.password = 'Must not be empty';
  if (isEmpty(playerName)) error.playerName = 'Must not be empty';
  if (Object.keys(error).length) {
    return res.json(error);
  }
  let userId = '';
  db.doc(`/players/${playerName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ playerName: 'Player name already taken' });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
          })
          .then((token) => {
            const player = generatePlayer(playerName, userId);
            return db
              .doc(`/players/${playerName}`)
              .set(player)
              .then(() => res.status(201).json(token))
              .catch((err) => console.log(err));
          })
          .catch((err) => {
            if (err.code == 'auth/email-already-in-use') {
              return res
                .status(400)
                .json({ email: 'Email already registered' });
            }
          });
      }
    });
  // .then((userCredential) => {
  //   var user = userCredential.user;
  //   db.collection('users').doc('playerName').create();
  //   res.json(user);
  // })
  // .catch((error) => {
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   res.json(error);
  // });
});

app.get('/players', async (req, res) => {
  try {
    const data = await db.collection('players').get();
    let players = [];
    data.forEach((doc) => players.push(doc.data()));
    res.json(players);
  } catch (err) {
    console.log(err);
  }
});

app.post('');

exports.api = functions.https.onRequest(app);
