import * as v from "@valibot/valibot";

export function step1(input: string[]): string {
  const { moveCoords, map } = parseInput(input);

  let lanternFishCoord = findLanternFishCoord(map);
  if (lanternFishCoord === null) {
    return "LanternFish not found";
  }

  for (const moveCoord of moveCoords) {
    const result = moveTile(map, lanternFishCoord, moveCoord);
    if (result !== false) {
      lanternFishCoord = result;
    }
  }

  const boxCoords = findAllBoxCoords(map);

  return boxCoords.reduce((acc, boxCoord) => {
    return acc + boxCoord[0] + boxCoord[1] * 100;
  }, 0).toString();
}

export function step2(input: string[]): string {
  const { moveCoords, map } = parseInput(input, true);

  let lanternFishCoord = findLanternFishCoord(map);
  if (lanternFishCoord === null) {
    return "LanternFish not found";
  }

  for (const moveCoord of moveCoords) {
    const result = moveTile(map, lanternFishCoord, moveCoord);
    if (result !== false) {
      lanternFishCoord = result;
    }
    console.log(
      map.map((line) => line.join("")).join("\n"),
      { moveCoord },
      "\n",
    );
  }

  const boxCoords = findAllBoxCoords(map);

  return boxCoords.reduce((acc, boxCoord) => {
    return acc + boxCoord[0] + boxCoord[1] * 100;
  }, 0).toString();
}

const moveBox = (map: Tiles[][], leftBoxCoord: Coord, move: Coord): boolean => {
  const [x, y] = leftBoxCoord;
  const [dx, dy] = move;
  const y1 = y + dy;
  const x1 = x + dx;
  const nextCoord = map[y1][x1];

  if (nextCoord === Tiles.WALL) {
    return false;
  }

  if (dx === 0) {
    const nextCoordRight = map[y1][x1 + 1];
    if (nextCoordRight === Tiles.WALL) {
      return false;
    }

    if (nextCoord === Tiles.BOX_LEFT) {
      if (!moveBox(map, [x1, y1], move)) {
        return false;
      }
    }

    if (nextCoord === Tiles.BOX_RIGHT) {
      if (nextCoordRight === Tiles.BOX_LEFT) {
        if (!moveBox(structuredClone(map), [x1 - 1, y1], move)) {
          return false;
        }
        if (!moveBox(map, [x1 + 1, y1], move)) {
          return false;
        }
      }
      if (!moveBox(map, [x1 - 1, y1], move)) {
        return false;
      }
    } else {
      if (nextCoordRight === Tiles.BOX_LEFT) {
        if (!moveBox(map, [x1 + 1, y1], move)) {
          return false;
        }
      }
    }
    map[y][x] = Tiles.EMPTY;
    map[y][x + 1] = Tiles.EMPTY;
  }

  if (dx === 1) {
    const nextTile = map[y1][x1 + 1];
    if (nextTile === Tiles.WALL) {
      return false;
    }

    if (nextTile === Tiles.BOX_LEFT) {
      if (!moveBox(map, [x1 + 1, y1], move)) {
        return false;
      }
    }
    map[y][x] = Tiles.EMPTY;
  }

  if (dx === -1) {
    if (nextCoord === Tiles.BOX_RIGHT) {
      if (!moveBox(map, [x1 - 1, y1], move)) {
        return false;
      }
    }
    map[y][x + 1] = Tiles.EMPTY;
  }

  map[y1][x1] = Tiles.BOX_LEFT;
  map[y1][x1 + 1] = Tiles.BOX_RIGHT;

  return true;
};

const findAllBoxCoords = (map: Tiles[][]): Coord[] => {
  const boxCoords: Coord[] = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === Tiles.BOX || map[i][j] === Tiles.BOX_LEFT) {
        boxCoords.push([j, i]);
      }
    }
  }
  return boxCoords;
};

const findLanternFishCoord = (map: Tiles[][]): Coord | null => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === Tiles.LANTERNFISH) {
        return [j, i];
      }
    }
  }
  return null;
};

const moveTile = (
  map: Tiles[][],
  coord: Coord,
  move: Coord,
): false | Coord => {
  const [x, y] = coord;
  const [dx, dy] = move;
  const y1 = y + dy;
  const x1 = x + dx;
  const currentCoord = map[y][x];
  const nextCoord = map[y1][x1];

  if (nextCoord === Tiles.WALL) {
    return false;
  }

  if (
    nextCoord === Tiles.BOX
  ) {
    if (!moveTile(map, [x1, y1], move)) {
      return false;
    }
  }
  if (nextCoord === Tiles.BOX_LEFT) {
    if (!moveBox(map, [x1, y1], move)) {
      return false;
    }
  }

  if (nextCoord === Tiles.BOX_RIGHT) {
    if (!moveBox(map, [x1 - 1, y1], move)) {
      return false;
    }
  }

  map[y1][x1] = currentCoord;
  map[y][x] = Tiles.EMPTY;

  return [x1, y1];
};

const parseInput = (input: string[], withTransformMap = false) => {
  const separatorIndex = input.findIndex((line) => line === "");

  const moveCoords = input.slice(separatorIndex + 1).join("").split("").map((
    char,
  ) => v.parse(moveSchema, char));
  const map = input.slice(0, separatorIndex).map((line) => {
    if (withTransformMap) {
      for (const key of Object.entries(transformMap)) {
        line = line.replaceAll(key[0], key[1]);
      }
    }
    return line.split("").map((char) => v.parse(tileSchema, char));
  });
  return { moveCoords: moveCoords, map };
};

const Tiles = {
  WALL: "#",
  EMPTY: ".",
  BOX: "O",
  BOX_LEFT: "[",
  BOX_RIGHT: "]",
  LANTERNFISH: "@",
} as const;

type Tiles = typeof Tiles[keyof typeof Tiles];

const moveToCoords = {
  "<": [-1, 0],
  ">": [1, 0],
  "^": [0, -1],
  "v": [0, 1],
} as const satisfies Record<Move, Coord>;

const Move = {
  LEFT: "<",
  RIGHT: ">",
  UP: "^",
  DOWN: "v",
} as const;

type Move = typeof Move[keyof typeof Move];

const moveSchema = v.pipe(
  v.string(),
  v.enum(Move),
  v.transform((move) => moveToCoords[move]),
);

const tileSchema = v.pipe(v.string(), v.enum(Tiles));

type Coord = [number, number];

const transformMap = {
  [Tiles.WALL]: Tiles.WALL + Tiles.WALL,
  [Tiles.EMPTY]: Tiles.EMPTY + Tiles.EMPTY,
  [Tiles.BOX]: Tiles.BOX_LEFT + Tiles.BOX_RIGHT,
  [Tiles.LANTERNFISH]: Tiles.LANTERNFISH + Tiles.EMPTY,
};
