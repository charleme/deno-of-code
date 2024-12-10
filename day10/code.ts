export function step1(input: string[]): string {
  const parsedInput = parseInput(input);
  const starts = findStarts(parsedInput);
  const destinations = new Set<string>();

  for (const start of starts) {
    const newDestinations = getRoadDestinations(start, parsedInput);

    for (const newDestination of newDestinations) {
      destinations.add(start.join(",") + "_" + newDestination.join(","));
    }
  }

  return destinations.size.toString();
}

export function step2(input: string[]): string {
  const parsedInput = parseInput(input);
  const starts = findStarts(parsedInput);
  const destinations: Coord[] = [];

  for (const start of starts) {
    const newDestinations = getRoadDestinations(start, parsedInput);

    destinations.push(...newDestinations);
  }

  return destinations.length.toString();
}

const parseInput = (input: string[]) => {
  return input.map((line) =>
    line.split("").map((char) => char !== "." ? Number(char) : -1)
  );
};

const findStarts = (input: number[][]) => {
  const starts: Coord[] = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === 0) {
        starts.push([j, i]);
      }
    }
  }
  return starts;
};

const getRoadDestinations = ([x, y]: Coord, input: number[][]): Coord[] => {
  const curVal = input[y][x];
  if (curVal === 9) {
    return [[x, y]];
  }

  const nextCoords = getNextCoord([x, y], input[0].length, input.length);
  const possibleNextCoords: Coord[] = [];

  for (const [nx, ny] of nextCoords) {
    const val = input[ny][nx];
    if (val === curVal + 1) {
      possibleNextCoords.push([nx, ny]);
    }
  }

  return possibleNextCoords
    .flatMap((nextCoord) => getRoadDestinations(nextCoord, input));
};

const getNextCoord = ([x, y]: Coord, X: number, Y: number) => {
  const diffCoord = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const allCoords = diffCoord
    .map(([dx, dy]) => [x + dx, y + dy] satisfies Coord);
  return allCoords
    .filter(([x, y]) => x >= 0 && x < X && y >= 0 && y < Y);
};

type Coord = [number, number];
