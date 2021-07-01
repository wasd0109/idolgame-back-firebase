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
  damage =
    Math.floor(Math.random() * attack) - Math.floor(Math.random() * defense);
  if (damage <= 0 || Math.random() * defendAgility > attackAgility * 0.9) {
    return 0;
  }
  return damage;
};

const generatePlayerMessage = (damage) => {
  if (damage) {
    return `You dealt ${damage} points of damage!`;
  } else {
    return 'The enemy evaded the attack!';
  }
};

const generateEnemyMessage = (damage) => {
  if (damage) {
    return `You received ${damage} points of damage!`;
  } else {
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
    enemyHP -= damage;
    result = { message, enemyHP };
  } else if (turnNumber % 2 == 1) {
    damage = calculateBattleResult(attackMode, enemyStats, playerStats);
    message = generateEnemyMessage(damage);
    playerHP -= damage;
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
