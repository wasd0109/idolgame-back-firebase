const { db } = require('../utils/admin');

const isLevelUp = (exp, level) => {
  const exponent = 1.1;
  const baseXP = 30;
  if (exp >= Math.floor(baseXP * level ** exponent)) {
    return { newLevel: ++level, levelUp: true };
  }
  return { newLevel: level, levelUp: false };
};

const applyStatsChange = (stats, level, exp) => {
  let { HP, attack, defense, magic_attack, magic_defense, agility } = stats;
  const newStats = {
    HP: HP + Math.floor(Math.random() * 15),
    attack: attack + Math.floor(Math.random() * 5),
    defense: defense + Math.floor(Math.random() * 5),
    magic_attack: magic_attack + Math.floor(Math.random() * 5),
    magic_defense: magic_defense + Math.floor(Math.random() * 5),
    agility: agility + Math.floor(Math.random() * 3),
    level,
    exp,
  };
  return newStats;
};

exports.actions = async (req, res) => {
  const uid = req.user.uid;
  let player = [];
  console.log(uid);
  const docs = await db
    .collection('players')
    .where('uid', '=', uid)
    .limit(1)
    .get();
  docs.forEach((doc) => player.push(doc.data()));
  const stats = player[0];
  const minimumEXP = 5;
  const newEXP = stats.exp + minimumEXP + Math.floor(Math.random() * 10);
  const { newLevel, levelUp } = isLevelUp(newEXP, stats.level);
  console.log(newEXP, levelUp);
  const newStats = levelUp
    ? applyStatsChange(stats, newLevel, newEXP)
    : { ...stats, exp: newEXP };
  try {
    await db.collection('players').doc(stats.playerName).update(newStats);
    return res.status(200).json('Action successful');
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err });
  }
};
