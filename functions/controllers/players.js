const { db } = require('../utils/admin');

exports.getPlayers = async (req, res) => {
  try {
    const data = await db.collection('players').get();
    let players = [];
    data.forEach((doc) => players.push(doc.data()));
    res.json(players);
  } catch (err) {
    console.log(err);
  }
};

exports.profile = async (req, res) => {
  console.log(req.user.uId);
  const { uid } = req.user;
  console.log(uid);
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
