const { db } = require('../utils/admin');
const { battle } = require('../utils/battle');

exports.bossData = async (req, res) => {
  const { bossProgress } = req.body;
  let bosses = [];
  console.log(typeof bossProgress);
  try {
    const docs = await db
      .collection('bosses')
      .where('bossId', '=', bossProgress)
      .limit(1)
      .get();
    docs.forEach((doc) => bosses.push(doc.data()));
  } catch (err) {
    console.log(err);
  }
  const boss = bosses[0];
  res.status(200).json({ boss });
};

exports.bossFight = (req, res) => {
  const { player, boss, attackMode, turnNumber } = req.body;
  console.log(player, boss, attackMode, turnNumber);
  //   const boss = {
  //     HP: 100,
  //     attack: 10,
  //     defense: 9,
  //     magic_attack: 100,
  //     magic_defense: 10,
  //     agility: 20,
  //     luck: 4,
  //   };
  //   const player = {
  //     HP: 100,
  //     attack: 10,
  //     defense: 9,
  //     magic_attack: 100,
  //     magic_defense: 10,
  //     agility: 20,
  //     luck: 4,
  //   };
  //   const attackMode = 'physical';
  const result = battle(player, boss, attackMode, turnNumber);
  console.log(result);
  res.json(result);
};
