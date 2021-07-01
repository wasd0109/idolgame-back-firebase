const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
const { FBAuth } = require('./utils/fbAuth');
const { login, register } = require('./controllers/users');
const { getPlayers, profile } = require('./controllers/players');
const { actions } = require('./controllers/actions');
const { bossFight, bossData } = require('./controllers/boss');

app.use(cors({ origin: true }));

app.post('/register', register);

app.get('/players', FBAuth, getPlayers);

app.get('/profile', FBAuth, profile);

app.get('/bossData', bossData);

app.post('/login', login);

app.post('/actions', FBAuth, actions);

app.post('/bossFight', bossFight);

exports.api = functions.https.onRequest(app);
