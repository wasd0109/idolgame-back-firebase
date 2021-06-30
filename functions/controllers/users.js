const { validateRegister, validateLogin } = require('../utils/validators');
const firebase = require('firebase');
const generatePlayer = require('./generatePlayer');
const initializeFirebase = require('../utils/firebaseInit');
const { db } = require('../utils/admin');
initializeFirebase();

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let userId;
  const validation = validateLogin({ email, password });
  if (!validation.valid) {
    return res.status(400).json(validation.error);
  }
  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const token = await data.user.getIdToken();
    userId = data.user.uid;
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(404).json({ user: 'Not Found' });
  }
};

exports.register = (req, res) => {
  const { email, password, confirmPassword, playerName } = req.body;
  const validation = validateRegister({
    email,
    password,
    confirmPassword,
    playerName,
  });
  if (!validation.valid) {
    return res.status(400).json(validation.error);
  }
  let userId = '';
  db.doc(`/players/${playerName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ error: 'Player name already taken' });
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
              .then(() => res.status(201).json({ token }))
              .catch((err) => console.log(err));
          })
          .catch((err) => {
            if (err.code == 'auth/email-already-in-use') {
              return res
                .status(400)
                .json({ error: 'Email already registered' });
            } else if (err.code == 'auth/weak-password');
            {
              return res.status(400).json({ error: 'Password too short' });
            }
          });
      }
    });
};
