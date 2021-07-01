const { db } = require('../utils/admin');

const isLevelUp = (exp, level) => {
  const exponent = 1.1;
  const baseXP = 30;
  if (exp >= Math.floor(baseXP * level ** exponent)) {
    return { newLevel: ++level, levelUp: true };
  }
  return { newLevel: level, levelUp: false };
};

const applyStatsChange = (stats, statsIncrease) => {
  let { HP, attack, defense, magic_attack, magic_defense, agility } = stats;
  const {
    HPIncrease,
    attackIncrease,
    defenseIncrease,
    magic_attackIncrease,
    magic_defenseIncrease,
    agilityIncrease,
    exp,
    level,
  } = statsIncrease;
  const newStats = {
    HP: HP + HPIncrease,
    attack: attack + attackIncrease,
    defense: defense + defenseIncrease,
    magic_attack: magic_attack + magic_attackIncrease,
    magic_defense: magic_defense + magic_defenseIncrease,
    agility: agility + agilityIncrease,
    level,
    exp,
  };
  return newStats;
};

const generateResponseMessage = (exp, newEXP, statsIncrease = null) => {
  let message = `Action Success, +${newEXP - exp} exp`;
  if (statsIncrease != null) {
    const {
      HPIncrease,
      attackIncrease,
      defenseIncrease,
      magic_attackIncrease,
      magic_defenseIncrease,
      agilityIncrease,
    } = statsIncrease;
    const statsMessage = `Level up, +${HPIncrease} HP, +${attackIncrease} attack, +${defenseIncrease} defense, +${magic_attackIncrease} magic attack, +${magic_defenseIncrease} magic defense, +${agilityIncrease} agility`;
    return `${message}\n${statsMessage}`;
  }
  return message;
};
const handleActionResults = (stats) => {
  const minimumEXP = 5;
  const HPModifier = 15;
  const fightStatsModifier = 5;
  const agilityModifier = 3;
  const newEXP = stats.exp + minimumEXP + Math.floor(Math.random() * 10);
  const { newLevel, levelUp } = isLevelUp(newEXP, stats.level);
  let newStats;
  let message;
  if (levelUp) {
    const statsIncrease = {
      HPIncrease: Math.floor(Math.random() * HPModifier) + 1,
      attackIncrease: Math.floor(Math.random() * fightStatsModifier) + 1,
      defenseIncrease: Math.floor(Math.random() * fightStatsModifier) + 1,
      magic_attackIncrease: Math.floor(Math.random() * fightStatsModifier) + 1,
      magic_defenseIncrease: Math.floor(Math.random() * fightStatsModifier) + 1,
      agilityIncrease: Math.floor(Math.random() * agilityModifier) + 1,
      level: newLevel,
      exp: newEXP,
    };
    newStats = applyStatsChange(stats, statsIncrease);
    message = generateResponseMessage(stats.exp, newEXP, statsIncrease);
  } else if (!levelUp) {
    newStats = { ...stats, exp: newEXP };
    message = generateResponseMessage(stats.exp, newEXP);
  }
  return { newStats, message };
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
  const { newStats, message } = handleActionResults(stats);

  try {
    await db.collection('players').doc(stats.playerName).update(newStats);
    return res.status(200).json({ message });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err });
  }
};
