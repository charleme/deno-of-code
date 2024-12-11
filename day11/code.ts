export function step1(input: string[]): string {
  let parsedInput = parseInput(input[0]);

  for (let i = 0; i < 25; i++) {
    parsedInput = transformInput(parsedInput);
  }

  return parsedInput.length.toString();
}

// too low 22938365706844 221632504974231
export function step2(input: string[]): string {
  const parsedInput = parseInput(input[0]);
  let result = parsedInput.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.toString()] = (acc[curr.toString()] || 0) + 1;
    return acc;
  }, {});

  for (let i = 0; i < 75; i++) {
    const tmp: typeof result = {};

    for (const [key, value] of Object.entries(result)) {
      const vals = transformInput([Number(key)]);
      for (const val of vals) {
        tmp[val.toString()] = (tmp[val.toString()] || 0) + value;
      }
    }
    result = tmp;
  }

  return Object.entries(result).reduce((acc, curr) => acc + curr[1], 0)
    .toString();
}

const transformInput = (input: number[]): number[] => {
  return input.reduce<number[]>((acc, curr) => {
    // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
    if (curr === 0) {
      acc.push(1);
      return acc;
    }

    // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
    if (curr.toString().length % 2 === 0) {
      const half = curr.toString().length / 2;
      const left = Number(curr.toString().slice(0, half));
      const right = Number(curr.toString().slice(half));

      acc.push(left, right);
      return acc;
    }

    // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone
    acc.push(curr * 2024);
    return acc;
  }, []);
};

const parseInput = (input: string) => {
  return input.split(" ").map(Number);
};
