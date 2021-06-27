const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const cors = require('cors');
const firebase = require('firebase');
const initializeFirebase = require('./firebaseInit');
const generatePlayer = require('./controllers/generatePlayer');

initializeFirebase();
admin.initializeApp();
app.use(cors({ origin: true }));

const db = admin.firestore();

const isEmpty = (text) => {
  return text.trim().length === 0 ? true : false;
};

app.post('/register', (req, res) => {
  const { email, password, confirmPassword, playerName } = req.body;
  let error = {};
  if (isEmpty(email)) error.email = 'Must not be empty';
  if (isEmpty(password)) error.password = 'Must not be empty';
  if (isEmpty(playerName)) error.playerName = 'Must not be empty';
  if (password !== confirmPassword)
    error.confirmPassword = "Password don't match";
  if (Object.keys(error).length) {
    return res.status(400).json(error);
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
              .then(() => res.status(201).json({ token, userId }))
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

app.get('/profile', async (req, res) => {
  const { userId } = req.body;
  try {
    const data = await db
      .collection('players')
      .where('uid', '==', userId)
      .get();
    const player = data.docs[0].data();
    return res.json(player);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let error = {};
  let userId;
  if (isEmpty(email)) error.email = 'Must not be empty';
  if (isEmpty(password)) error.password = 'Must not be empty';
  if (Object.keys(error).length) {
    return res.status(400).json(error);
  }
  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const token = await data.user.getIdToken();
    userId = data.user.uid;
    res.status(200).json({ token, userId });
  } catch (err) {
    console.log(err);
  }
});

exports.api = functions.https.onRequest(app);
