const randomizeElementAndLuck = () => {
  const elements = ['fire', 'water', 'electric', 'grass'];
  const number = Math.floor(Math.random() * 10);
  return {
    luck: number,
    element: elements[number % 4],
  };
};

const initialStats = {
  HP: 100,
  level: 1,
  exp: 0,
  attack: 20,
  defense: 15,
  magic_attack: 30,
  magic_defense: 25,
  agility: 10,
  title: 'Rookie',
  bossProgress: 0,
};

const generatePlayer = (playerName, uid) => {
  const { luck, element } = randomizeElementAndLuck();
  const player = {
    uid,
    playerName,
    ...initialStats,
    luck,
    element,
  };
  return player;
};

module.exports = generatePlayer;
