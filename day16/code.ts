type State = {
  score: number;
  currentDirection: Directions | null;
  visitedPlaces: Set<string>;
  lastCoord: Coord;
  possibleMinScore: number;
};

export function step1(input: string[]): string {
  const { sides, start, end } = parseInput(input);

  const stringStart = coordToString(start);
  const states: State[] = [
    {
      score: 0,
      currentDirection: null,
      visitedPlaces: new Set([stringStart]),
      lastCoord: start,
      possibleMinScore: getMinimumDistance(start, end, null),
    },
  ];

  const visitedPlaces: Set<string> = new Set();

  let currentState = states.shift();
  const endString = coordToString(end);

  let currentLastCoordString = coordToString(currentState?.lastCoord ?? [0, 0]);

  while (currentState !== undefined && currentLastCoordString !== endString) {
    visitedPlaces.add(currentLastCoordString);
    const nextCoords = Array.from(sides[currentLastCoordString]).map(
      stringToCoord,
    );

    for (const nextCoord of nextCoords) {
      const nextCoordString = coordToString(nextCoord);
      if (visitedPlaces.has(nextCoordString)) {
        continue;
      }

      const newSideDirection = getSideDirection(
        currentState.lastCoord,
        nextCoord,
      );
      const dist = (currentState.currentDirection === null &&
          isEast(currentState.lastCoord, nextCoord)) ||
          newSideDirection ===
            currentState.currentDirection
        ? 1
        : 1001;

      const newState: State = {
        score: currentState.score + dist,
        currentDirection: newSideDirection,
        visitedPlaces: new Set([
          ...currentState.visitedPlaces,
          nextCoordString,
        ]),
        lastCoord: nextCoord,
        possibleMinScore: currentState.score + dist +
          getMinimumDistance(nextCoord, end, newSideDirection),
      };

      // insert into states in score order
      const index = states.findIndex((state) =>
        state.possibleMinScore > newState.possibleMinScore
      );

      if (index === -1) {
        states.push(newState);
      } else {
        states.splice(index, 0, newState);
      }
    }

    currentState = states.shift();
    currentLastCoordString = coordToString(currentState?.lastCoord ?? [0, 0]);
  }

  return currentState?.score.toString() ?? "NOT FOUND";
}

// 412 is too low
export function step2(input: string[]): string {
  const { sides, start, end } = parseInput(input);

  const stringStart = coordToString(start);
  const states: State[] = [
    {
      score: 0,
      currentDirection: null,
      visitedPlaces: new Set([stringStart]),
      lastCoord: start,
      possibleMinScore: getMinimumDistance(start, end, null),
    },
  ];

  const visitedPlacesWithScore: Record<string, number> = {};

  let currentState = states.shift();
  const endString = coordToString(end);

  let currentLastCoordString = coordToString(currentState?.lastCoord ?? [0, 0]);

  const possiblePaths: State[] = [];

  let minDist = Number.POSITIVE_INFINITY;
  while (
    currentState !== undefined && currentState.possibleMinScore <= minDist
  ) {
    if (currentLastCoordString === endString) {
      minDist = currentState.score;
      possiblePaths.push(currentState);
    }

    const coordStringWithDirection =
      `${currentLastCoordString}-${currentState.currentDirection}`;
    if (
      visitedPlacesWithScore[coordStringWithDirection] &&
      visitedPlacesWithScore[coordStringWithDirection] < currentState.score
    ) {
      currentState = states.shift();
      currentLastCoordString = coordToString(currentState?.lastCoord ?? [0, 0]);
      continue;
    }

    visitedPlacesWithScore[coordStringWithDirection] = currentState.score;

    const nextCoords = Array.from(sides[currentLastCoordString]).map(
      stringToCoord,
    );

    for (const nextCoord of nextCoords) {
      const nextCoordString = coordToString(nextCoord);

      if (currentState.visitedPlaces.has(nextCoordString)) {
        continue;
      }

      const newSideDirection = getSideDirection(
        currentState.lastCoord,
        nextCoord,
      );
      const dist = (currentState.currentDirection === null &&
          isEast(currentState.lastCoord, nextCoord)) ||
          newSideDirection ===
            currentState.currentDirection
        ? 1
        : 1001;

      const newScore = currentState.score + dist;

      const newState: State = {
        score: newScore,
        currentDirection: newSideDirection,
        visitedPlaces: new Set([
          ...currentState.visitedPlaces,
          nextCoordString,
        ]),
        lastCoord: nextCoord,
        possibleMinScore: newScore +
          getMinimumDistance(nextCoord, end, newSideDirection),
      };

      // insert into states in score order
      const index = states.findIndex((state) =>
        state.possibleMinScore > newState.possibleMinScore
      );

      if (index === -1) {
        states.push(newState);
      } else {
        states.splice(index, 0, newState);
      }
    }

    currentState = states.shift();
    currentLastCoordString = coordToString(currentState?.lastCoord ?? [0, 0]);
  }
  if (!currentState) {
    return "NOT FOUND";
  }

  for (const possiblePath of possiblePaths) {
    for (const possiblePathCoordString of possiblePath.visitedPlaces) {
      const [x, y] = stringToCoord(possiblePathCoordString);
      input[y] = input[y].substring(0, x) + "O" + input[y].substring(x + 1);
    }
  }

  return possiblePaths.reduce((acc, path) => {
    return new Set([...acc, ...path.visitedPlaces]);
  }, new Set()).size.toString();
}

const parseInput = (input: string[]) => {
  const matrix = input.map((line) => line.split(""));
  const sides: Record<string, Set<string>> = {};

  const nextCoords = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  const pathTiles = [".", "S", "E"];

  let start: Coord = [0, 0];
  let end: Coord = [0, 0];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === "S") {
        start = [x, y];
      }
      if (matrix[y][x] === "E") {
        end = [x, y];
      }
      if (pathTiles.includes(matrix[y][x])) {
        const coordString = coordToString([x, y]);
        sides[coordString] = new Set();
        for (const [dx, dy] of nextCoords) {
          const nextedCoord: Coord = [x + dx, y + dy];
          if (
            matrix[nextedCoord[1]] &&
            pathTiles.includes(matrix[nextedCoord[1]][nextedCoord[0]])
          ) {
            const nextedCoordString = coordToString(nextedCoord);
            sides[coordString].add(nextedCoordString);
          }
        }
      }
    }
  }

  return {
    sides,
    start,
    end,
  };
};

const coordToString = (coord: Coord) => coord.join(",");
const stringToCoord = (coord: string): Coord =>
  coord.split(",").map(Number) as Coord;

type Coord = [number, number];

const getSideDirection = (from: Coord, to: Coord): Directions => {
  if (from[0] === to[0]) {
    return Directions.VERTICAL;
  }
  return Directions.HORIZONTAL;
};

const isEast = (from: Coord, to: Coord) =>
  getSideDirection(from, to) === Directions.HORIZONTAL && from[0] < to[0];

const getMinimumDistance = (
  from: Coord,
  to: Coord,
  currentDirection: Directions | null,
) => {
  const dx = from[0] - to[0];
  const dy = from[1] - to[1];
  const dist = Math.abs(dx) + Math.abs(dy);

  if (dx === 0 && currentDirection === Directions.VERTICAL) {
    return dist;
  }

  if (dy === 0 && currentDirection === Directions.HORIZONTAL) {
    return dist;
  }

  return dist + 1000;
};

const Directions = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
};

type Directions = typeof Directions[keyof typeof Directions];
