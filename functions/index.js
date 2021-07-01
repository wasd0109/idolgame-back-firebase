const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
const { FBAuth } = require('./utils/fbAuth');
const { login, register } = require('./controllers/users');
const { getPlayers, profile } = require('./controllers/players');
const { actions } = require('./controllers/actions');

app.use(cors({ origin: true }));

app.post('/register', register);

app.get('/players', FBAuth, getPlayers);

app.get('/profile', FBAuth, profile);

app.post('/login', login);

app.post('/actions', FBAuth, actions);

exports.api = functions.https.onRequest(app);
