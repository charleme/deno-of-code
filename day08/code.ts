export function step1(input: string[]): string {
  const inputMapped = parseInput(input);
  const Y = input.length;
  const X = input[0].length;

  const antiNodes: Set<string> = new Set();

  for (const [_, coords] of Object.entries(inputMapped)) {
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const antiNodeCoords = getAntiNodeCoord(coords[i], coords[j]).filter(
          (coord) => isValidAntiNodeCoord(coord, X, Y),
        ).map(([x, y]) => `${x},${y}`);

        for (const antiNodeCoord of antiNodeCoords) {
          antiNodes.add(antiNodeCoord);
        }
      }
    }
  }

  return antiNodes.size.toString();
}

export function step2(input: string[]): string {
  const inputMapped = parseInput(input);
  const Y = input.length;
  const X = input[0].length;

  const antiNodes: Set<string> = new Set();

  for (const [_, coords] of Object.entries(inputMapped)) {
    for (let i = 0; i < coords.length; i++) {
      antiNodes.add(coords[i].join(","));
      for (let j = i + 1; j < coords.length; j++) {
        const antiNodeCoords = getAntiNodeCoordWithReccursive(
          coords[i],
          coords[j],
          X,
          Y,
        ).map(([x, y]) => `${x},${y}`);

        for (const antiNodeCoord of antiNodeCoords) {
          antiNodes.add(antiNodeCoord);
        }
      }
    }
  }

  return antiNodes.size.toString();
}

const parseInput = (input: string[]) => {
  const inputMapped: Record<string, Coord[]> = {};
  const matrixInput = input.map((line) => line.split(""));

  for (let y = 0; y < matrixInput.length; y++) {
    for (let x = 0; x < matrixInput[y].length; x++) {
      const char = matrixInput[y][x];
      if (char !== ".") {
        inputMapped[char] = inputMapped[char]
          ? [...inputMapped[char], [x, y]]
          : [[x, y]];
      }
    }
  }

  return inputMapped;
};

const getAntiNodeCoord = (
  [x1, y1]: Coord,
  [x2, y2]: Coord,
): [Coord, Coord] => {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;

  return [[x2 + xDiff, y2 + yDiff], [x1 - xDiff, y1 - yDiff]];
};

const getAntiNodeCoordWithReccursive = (
  [x1, y1]: Coord,
  [x2, y2]: Coord,
  X: number,
  Y: number,
): Coord[] => {
  const validAntiNodes: Coord[] = [];
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;

  let topPosition: Coord = [x2 + xDiff, y2 + yDiff];
  let bottomPosition: Coord = [x1 - xDiff, y1 - yDiff];

  while (isValidAntiNodeCoord(topPosition, X, Y)) {
    validAntiNodes.push(topPosition);
    topPosition = [topPosition[0] + xDiff, topPosition[1] + yDiff];
  }

  while (isValidAntiNodeCoord(bottomPosition, X, Y)) {
    validAntiNodes.push(bottomPosition);
    bottomPosition = [bottomPosition[0] - xDiff, bottomPosition[1] - yDiff];
  }

  return validAntiNodes;
};

const isValidAntiNodeCoord = (
  [x, y]: Coord,
  X: number,
  Y: number,
) => {
  return x >= 0 && x < X && y >= 0 && y < Y;
};

type Coord = [number, number];
