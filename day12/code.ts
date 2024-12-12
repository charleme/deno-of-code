export function step1(input: string[]): string {
  const visitedPlaces = new Set<string>();

  const parsedInput = parseInput(input);

  let sum = 0;

  for (let y = 0; y < parsedInput.length; y++) {
    for (let x = 0; x < parsedInput[y].length; x++) {
      const key = fromCoordToString([x, y]);
      if (visitedPlaces.has(key)) continue;

      const { area, perimeter } = getAllConnectedCoordsOfTheSameValue(
        parsedInput,
        [x, y],
        visitedPlaces,
        { area: 1, perimeter: [] },
      );

      sum += area * perimeter.length;
    }
  }

  return sum.toString();
}

export function step2(input: string[]): string {
  const visitedPlaces = new Set<string>();

  const parsedInput = parseInput(input);

  let sum = 0;

  for (let y = 0; y < parsedInput.length; y++) {
    for (let x = 0; x < parsedInput[y].length; x++) {
      const key = fromCoordToString([x, y]);
      if (visitedPlaces.has(key)) continue;

      const { area, perimeter } = getAllConnectedCoordsOfTheSameValue(
        parsedInput,
        [x, y],
        visitedPlaces,
        { area: 1, perimeter: [] },
      );
      const sideNumber = getSideNumberFromPerimeterCoord(perimeter);

      sum += area * sideNumber;
    }
  }

  return sum.toString();
}

type Side = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Perimeter = { coord: Coord; side: Side }[];
const getAllConnectedCoordsOfTheSameValue = (
  parsedInput: string[][],
  coord: Coord,
  visitedPlaces: Set<string>,
  currentScore: {
    area: number;
    perimeter: Perimeter;
  },
) => {
  const curVal = parsedInput[coord[1]][coord[0]];
  visitedPlaces.add(fromCoordToString(coord));

  const nextCoord = [[-1, 0, "LEFT"], [1, 0, "RIGHT"], [0, -1, "UP"], [
    0,
    1,
    "DOWN",
  ]] as const;
  for (const [dx, dy, direction] of nextCoord) {
    const newCoord: Coord = [coord[0] + dx, coord[1] + dy];
    if (
      newCoord[0] < 0 || newCoord[0] >= parsedInput[0].length ||
      newCoord[1] < 0 || newCoord[1] >= parsedInput.length
    ) {
      currentScore.perimeter.push({ coord, side: direction });
      continue;
    }
    if (parsedInput[newCoord[1]][newCoord[0]] !== curVal) {
      currentScore.perimeter.push({
        coord,
        side: direction,
      });
      continue;
    }
    const newKey = fromCoordToString(newCoord);

    if (visitedPlaces.has(newKey)) continue;
    currentScore.area = currentScore.area + 1;

    getAllConnectedCoordsOfTheSameValue(
      parsedInput,
      newCoord,
      visitedPlaces,
      currentScore,
    );
  }

  return currentScore;
};

const getSideNumberFromPerimeterCoord = (perimeter: Perimeter) => {
  let sides = 0;
  const mappedPerimeter: Record<Side, Record<string, number[]>> = {
    UP: {},
    DOWN: {},
    LEFT: {},
    RIGHT: {},
  };
  for (const { coord, side } of perimeter) {
    if (side === "UP" || side === "DOWN") {
      mappedPerimeter[side][coord[1]] = mappedPerimeter[side][coord[1]] || [];
      mappedPerimeter[side][coord[1]].push(coord[0]);
    }

    if (side === "LEFT" || side === "RIGHT") {
      mappedPerimeter[side][coord[0]] = mappedPerimeter[side][coord[0]] || [];
      mappedPerimeter[side][coord[0]].push(coord[1]);
    }
  }

  for (const sideValues of Object.values(mappedPerimeter)) {
    for (const values of Object.values(sideValues)) {
      const sortedValues = values.sort((a, b) => a - b);

      sortedValues.reduce<number | undefined>((prev, cur) => {
        if (prev !== cur - 1) {
          sides++;
        }
        return cur;
      }, undefined);
    }
  }

  return sides;
};

const parseInput = (input: string[]) => {
  return input.map((line) => line.split(""));
};

const fromCoordToString = ([x, y]: Coord) => `${x},${y}`;

type Coord = [number, number];
