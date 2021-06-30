const maxArea = 6000;

const pairs = [];

for (i = 1; i <= 400; i++) {
  for (j = 1; j <= 400; j++) {
    const leftSide = i * i + j * j;
    const area = (i * j) / 2;
    const rightSide = Math.sqrt(leftSide);
    if (Number.isInteger(rightSide) && area <= maxArea) {
      console.log(area);
      if (
        !pairs.includes(`${i}+${j}=${rightSide}`) &&
        !pairs.includes(`${j}+${i}=${rightSide}`)
      ) {
        pairs.push(`${i}+${j}=${rightSide}`);
      }
    }
  }
}

console.log(pairs.length);
