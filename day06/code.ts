export function step1(input: string[]): string {
  const parsedInput = parseInput(input);

  return getVisitedPositions(parsedInput).size.toString();
}

export function step2(input: string[]): string {
  const parsedDefaultInput = parseInput(input);
  const visitedStringPositions = getVisitedPositions(parsedDefaultInput);
  const visitedPositions = Array.from(visitedStringPositions).map(
    getPositionFromString,
  );

  let sum = 0;
  const defaultDir = "N";
  const defaultPos = getAgentCoordinates(parsedDefaultInput);

  for (const visitedPosition of visitedPositions) {
    const [i, j] = visitedPosition;
    let pos = defaultPos;
    const visited = new Set<string>();
    let dir: DIR = defaultDir;
    if (
      isPositionBlock([i, j], parsedDefaultInput) ||
      (i === defaultPos[0] && j === defaultPos[1])
    ) {
      continue;
    }

    const parsedInput = structuredClone(parsedDefaultInput);
    parsedInput[j][i] = "#";
    while (pos) {
      const [x, y] = pos;
      const posStr = getStringPositionWithDir(x, y, dir);

      if (visited.has(posStr)) {
        sum++;
        break;
      }

      visited.add(posStr);

      let nextPosition = getNextPosition(x, y, dir, parsedInput);

      while (
        nextPosition !== null && isPositionBlock(nextPosition, parsedInput)
      ) {
        dir = getNextDirection(dir);
        nextPosition = getNextPosition(x, y, dir, parsedInput);
      }

      if (nextPosition === null) {
        break;
      }

      pos = nextPosition;
    }
    step1(input);
  }

  return sum.toString();
}

const getVisitedPositions = (parsedInput: string[][]): Set<string> => {
  const visited = new Set<string>();
  let dir: DIR = "N";
  let pos = getAgentCoordinates(parsedInput);

  while (pos) {
    const [x, y] = pos;
    const posStr = getStringPosition(x, y);

    visited.add(posStr);

    let nextPosition = getNextPosition(x, y, dir, parsedInput);

    while (
      nextPosition !== null && isPositionBlock(nextPosition, parsedInput)
    ) {
      dir = getNextDirection(dir);
      nextPosition = getNextPosition(x, y, dir, parsedInput);
    }

    if (nextPosition === null) {
      break;
    }

    pos = nextPosition;
  }

  return visited;
};

const parseInput = (input: string[]): string[][] => {
  return input.map((line) => line.split(""));
};

const getStringPosition = (x: number, y: number): string => {
  return `${x},${y}`;
};

const getPositionFromString = (str: string): [number, number] => {
  const [x, y] = str.split(",");
  return [parseInt(x), parseInt(y)];
};

const getStringPositionWithDir = (
  x: number,
  y: number,
  dir: DIR,
): string => {
  return `${x},${y},${dir}`;
};

const isPositionBlock = (
  [x, y]: [number, number],
  input: string[][],
): boolean => {
  return input[y][x] === "#";
};

const getAgentCoordinates = (input: string[][]): [number, number] => {
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "^") {
        return [x, y];
      }
    }
  }
  return [-1, -1];
};

const getNextDirection = (currDir: DIR): DIR => {
  const currIndex = DIRS.indexOf(currDir);
  return DIRS[(currIndex + 1) % DIRS.length];
};

const getNextPosition = (
  x: number,
  y: number,
  dir: DIR,
  input: string[][],
): [number, number] | null => {
  const moves = {
    N: [0, -1],
    E: [1, 0],
    S: [0, 1],
    W: [-1, 0],
  };
  const [dx, dy] = moves[dir];
  const pos = [x + dx, y + dy] satisfies [number, number];
  return isValidPosition(pos[0], pos[1], input) ? pos : null;
};

const isValidPosition = (x: number, y: number, input: string[][]): boolean => {
  return y >= 0 && y < input.length && x >= 0 && x < input[y].length;
};

type DIR = "N" | "E" | "S" | "W";
const DIRS: DIR[] = ["N", "E", "S", "W"];
