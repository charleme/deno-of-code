export function step1(input: string[]): string {
  const { X, Y, bots } = parseInput(input);

  const cornerLeftXMax = Math.floor(X / 2) - 1;
  const cornerRightXMin = Math.ceil(X / 2) - 1;
  const cornerTopYMax = Math.floor(Y / 2) - 1;
  const cornerBottomYMin = Math.ceil(Y / 2) - 1;

  for (const bot of bots) {
    bot.x = positiveModulo(bot.x + bot.vx * TURN_NB, X);
    bot.y = positiveModulo(bot.y + bot.vy * TURN_NB, Y);
  }

  const result = bots.reduce((acc, curr) => {
    if (curr.x <= cornerLeftXMax && curr.y <= cornerTopYMax) acc[0]++;
    if (curr.x > cornerRightXMin && curr.y <= cornerTopYMax) acc[1]++;
    if (curr.x <= cornerLeftXMax && curr.y > cornerBottomYMin) acc[2]++;
    if (curr.x > cornerRightXMin && curr.y > cornerBottomYMin) acc[3]++;

    return acc;
  }, [0, 0, 0, 0]).reduce((acc, curr) => acc * curr);

  return result.toString();
}

export function step2(input: string[]): string {
  const { X, Y, bots } = parseInput(input);
  try {
    const tree = Deno.readTextFileSync(Deno.cwd() + "/day14/tree.txt");

    const treeMatrix = tree.split("\n").map((line) => line.split(""));

    for (let i = 0; i < 10000; i++) {
      for (const bot of bots) {
        bot.x = positiveModulo(bot.x + bot.vx, X);
        bot.y = positiveModulo(bot.y + bot.vy, Y);
      }

      if (isTree(X, Y, bots, treeMatrix)) {
        return (i + 1).toString();
      }
    }

    return "Not Found";
  } catch (error) {
    return "Error " + error;
  }
}

const parseInput = (input: string[]) => {
  const [Y, X] = input[0].split(" ").map(Number);

  const bots: Bot[] = input.slice(1).map((line) => {
    const matches = line.match(inputRegex);
    if (!matches) throw new Error(`Invalid input: ${line}`);

    const [x, y, vx, vy] = matches.slice(1, 5).map(
      Number,
    );

    return { x, y, vx, vy };
  });

  return { X, Y, bots };
};

const isTree = (X: number, Y: number, bots: Bot[], treeMatrix: string[][]) => {
  const grid = Array.from(
    { length: Y },
    () => Array.from({ length: X }, () => "."),
  );

  for (const bot of bots) {
    grid[bot.y][bot.x] = "#";
  }

  for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
      if (treeMatrix[y][x] !== grid[y][x]) {
        return false;
      }
    }
  }
  return true;
};

const inputRegex = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/;

const TURN_NB = 100;

const positiveModulo = (n: number, m: number) => ((n % m) + m) % m;

type Bot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};
