const { db } = require('../utils/admin');

exports.getPlayers = async (req, res) => {
  try {
    const data = await db.collection('players').get();
    let players = [];
    data.forEach((doc) => players.push(doc.data()));
    console.log(players);
    res.json(players);
  } catch (err) {
    console.log(err);
  }
};

exports.profile = async (req, res) => {
  const { uid } = req.user;
  try {
    const data = await db
      .collection('players')
      .where('uid', '==', uid)
      .limit(1)
      .get();
    const player = data.docs[0].data();
    return res.json(player);
  } catch (err) {
    res.status(400).json(err);
  }
};
