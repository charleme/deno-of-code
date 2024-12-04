export function step1(input: string[]): string {
  const inputGroupRow = input;
  const inputGroupColumn = input.map((row) => row.split("")).map(
    (row, indexRow) =>
      row.map((_, indexCol) => inputGroupRow[indexCol][indexRow]).join(""),
  );

  const inputGroupDiagonals = [
    ...getDiagonalStrings(input, true),
    ...getDiagonalStrings(input, false),
  ];

  return sum(
    getXmasCount(inputGroupRow),
    getXmasCount(inputGroupColumn),
    getXmasCount(inputGroupDiagonals),
  ).toString();
}

const getDiagonalStrings = (input: string[], firstDiag: boolean): string[] => {
  const M = input.length;
  const N = input[0].length;

  const inputGroupDiagonals: string[] = [];

  for (let i = -M + 1; i < N; i++) {
    let diagonal = "";
    let baseY = Math.max(0, i);
    if (baseY < 0) {
      baseY = 0;
    }

    let baseX = Math.max(0, -i);
    if (baseX < 0) {
      baseX = 0;
    }

    for (let j = 0; baseY + j < N && baseX + j < M; j++) {
      const x = baseX + j;
      const y = firstDiag ? baseY + j : N - (baseY + j) - 1;
      diagonal += input[x][y];
    }
    inputGroupDiagonals.push(diagonal);
  }

  return inputGroupDiagonals;
};

const sum = (...vals: number[]) => vals.reduce((acc, curr) => acc + curr, 0);

const getXmasCount = (input: string[]): number => {
  const matchesCount = regexes.flatMap((regex) =>
    input.map((row) => (row.match(regex) || []).length)
  );
  return sum(...matchesCount);
};

export function step2(input: string[]): string {
  const M = input.length;
  const N = input[0].length;
  let sum = 0;

  for (let i = 1; i < M - 1; i++) {
    for (let j = 1; j < N - 1; j++) {
      const char = input[i][j];
      if (char === "A") {
        if (
          (input[i - 1][j - 1] === "M" && input[i + 1][j + 1] === "S") ||
          (input[i - 1][j - 1] === "S" && input[i + 1][j + 1] === "M")
        ) {
          if (
            (input[i - 1][j + 1] === "M" && input[i + 1][j - 1] === "S") ||
            (input[i - 1][j + 1] === "S" && input[i + 1][j - 1] === "M")
          ) {
            sum++;
          }
        }
      }
    }
  }

  return sum.toString();
}

const regexes = [/XMAS/g, /SAMX/g];
