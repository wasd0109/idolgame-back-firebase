const { db } = require('../utils/admin');

const levelUpStatsChanges = (levelUp) => {
  const newHP = levelUp ? Math.floor(Math.random() * 15) : 0;
  const newAttack = levelUp ? Math.floor(Math.random() * 5) : 0;
  const newDefense = levelUp ? Math.floor(Math.random() * 5) : 0;
  const newMagicAttack = levelUp ? Math.floor(Math.random() * 5) : 0;
  const newMagicDefense = levelUp ? Math.floor(Math.random() * 5) : 0;
  const newAgility = levelUp ? Math.floor(Math.random() * 3) : 0;
  return {
    newHP,
    newAttack,
    newDefense,
    newMagicAttack,
    newMagicDefense,
    newAgility,
  };
};

const decideLevel = (exp, lv) => {
  const exponent = 1.1;
  const baseXP = 30;
  if (exp > Math.floor(baseXP * lv ** exponent)) {
    return ++lv;
  }
  return lv;
};

const updateStats = (stats) => {
  const {
    HP,
    attack,
    defense,
    magic_attack,
    magic_defense,
    agility,
    exp,
    level,
  } = stats;
  const newLv = decideLevel(exp, level);
  const {
    newHP,
    newAttack,
    newDefense,
    newMagicAttack,
    newMagicDefense,
    newAgility,
  } = levelUpStatsChanges(newLv > level);
  const minimumEXP = 5;
  const newEXP = exp + minimumEXP + Math.floor(Math.random() * 10);
  const newStats = {
    ...stats,
    HP: HP + newHP,
    attack: attack + newAttack,
    defense: defense + newDefense,
    magic_attack: magic_attack + newMagicAttack,
    magic_defense: magic_defense + newMagicDefense,
    agility: agility + newAgility,
    exp: newEXP,
    level: newLv,
  };
  const statsMessage = `Level up, +${newHP} HP, +${newAttack} attack, +${newDefense} defense, +${newMagicAttack} magic attack, +${newMagicDefense} magic defense, +${agility} agility`;
  const actionMessage = `Action Success, +${Number(newEXP) - exp} exp`;
  const message = !newHP
    ? actionMessage
    : [actionMessage, statsMessage].join('\n');
  return { newStats, message };
};

exports.actions = async (req, res) => {
  const { uid, action } = req.user;
  try {
    const data = await db
      .collection('players')
      .where('uid', '==', uid)
      .limit(1)
      .get();
    const player = data.docs[0].data();
    const { newStats, message } = updateStats(player);
    const { playerName } = newStats;
    try {
      await db
        .collection('players')
        .doc(playerName)
        .update({ ...newStats });
    } catch (err) {
      console.log(err);
    }
    return res.json({ message });
  } catch (err) {
    res.status(400).json(err);
  }
};
