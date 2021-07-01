const damageFormula = (attack, defense) => {
  return Math.floor(
    Math.random() * attack * 1.1 - Math.random() * defense * 0.8
  );
};

const calculateBattleResult = (attackMode, attackingStats, defendingStats) => {
  let damage;
  const attackAgility = attackingStats.agility;
  const defendAgility = defendingStats.agility;
  const luck = defendingStats.luck;
  let attack = 0;
  let defense = 0;
  if (attackMode == 'physical') {
    attack = attackingStats.attack;
    defense = defendingStats.defense;
  } else if (attackMode == 'magic') {
    attack = attackingStats.magic_attack;
    defense = defendingStats.magic_defense;
  }
  // Implement luck later (headache)
  damage = damageFormula(attack, defense);
  console.log(damage);
  if (damage <= 0) {
    return 0;
  } else if (Math.random() * defendAgility > attackAgility * 0.9) {
    return -1;
  }
  return damage;
};

const generatePlayerMessage = (damage) => {
  if (damage >= 0) {
    return damage
      ? `You dealt ${damage} points of damage!`
      : 'The enemy blocked your attack!';
  } else if (damage == -1) {
    return 'The enemy evaded the attack!';
  }
};

const generateEnemyMessage = (damage) => {
  if (damage >= 0) {
    return damage
      ? `You received ${damage} points of damage!`
      : 'You blocked the enemy attack!';
  } else if (damage == -1) {
    return 'You evaded the attack!';
  }
};

exports.battle = (playerStats, enemyStats, attackMode, turnNumber) => {
  let result = {};
  let message = '';
  let playerHP = playerStats.HP;
  let enemyHP = enemyStats.HP;

  if (turnNumber % 2 == 0) {
    damage = calculateBattleResult(attackMode, playerStats, enemyStats);
    message = generatePlayerMessage(damage);
    if (damage > 0) enemyHP -= damage;
    result = { message, enemyHP };
  } else if (turnNumber % 2 == 1) {
    damage = calculateBattleResult(attackMode, enemyStats, playerStats);
    message = generateEnemyMessage(damage);
    if (damage > 0) playerHP -= damage;
    result = { message, playerHP };
  }
  if (enemyHP <= 0) {
    return { status: 'You won!' };
  }
  if (playerHP <= 0) {
    return { status: 'You lose!' };
  }
  return result;
};
