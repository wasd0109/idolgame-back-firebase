const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
const { FBAuth } = require('./utils/fbAuth');
const { login, register } = require('./controllers/users');
const { getPlayers, profile } = require('./controllers/players');

app.use(cors({ origin: true }));

app.post('/register', register);

app.get('/players', getPlayers);

app.get('/profile', FBAuth, profile);

app.post('/login', login);

exports.api = functions.https.onRequest(app);
