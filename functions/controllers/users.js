const { validateRegister, validateLogin } = require('../utils/validators');
const firebase = require('firebase');
const generatePlayer = require('./generatePlayer');
const { initializeFirebase } = require('../utils/firebaseInit');
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

exports.register = async (req, res) => {
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
  let data = {};
  const doc = await db.doc(`/players/${playerName}`).get();
  if (doc.exists) {
    return res.status(400).json({ error: 'Player name already taken' });
  } else {
    try {
      data = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
    } catch (err) {
      if (err.code == 'auth/email-already-in-use') {
        return res.status(400).json({ error: 'Email already registered' });
      } else if (err.code == 'auth/weak-password');
      {
        return res.status(400).json({ error: 'Password too short' });
      }
    }
    userId = data.user.uid;
    try {
      const token = await data.user.getIdToken();
      const player = generatePlayer(playerName, userId);
      await db.doc(`/players/${playerName}`).set(player);
      return res.status(201).json({ token });
    } catch (err) {
      console.log(err);
    }
  }
};
