const sum = (vals: number[]) => vals.reduce((acc, curr) => acc + curr, 0);

export function step1(input: string[]): string {
  const parsedInput = input.map((line) => line.split("   ").map(Number));

  const firstRow = parsedInput.map(([x, y]) => x).toSorted();
  const lastRow = parsedInput.map(([x, y]) => y).toSorted();

  return sum(firstRow.map((x, i) => Math.abs(x - lastRow[i]))).toString();
}

export function step2(input: string[]): string {
  const parsedInput = input.map((line) => line.split("   ").map(Number));

  const firstRow = parsedInput.map(([x, y]) => x);
  const lastRow = parsedInput.map(([x, y]) => y);

  const indexedLastRow = lastRow.reduce<Record<string, number>>(
    (acc, curr) => {
      acc[curr] = (acc[curr] ?? 0) + curr;
      return acc;
    },
    {},
  );

  return sum(firstRow.map((v) => indexedLastRow[v.toString()] ?? 0)).toString();
}
