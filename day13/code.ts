export function step1(input: string[]): string {
  const parsedInput = parseInput(input);

  const sum = parsedInput.map(resolveEquation).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  return sum.toString();
}

export function step2(input: string[]): string {
  const parsedInput = parseInput(input);

  const sum = parsedInput.map((equation) => ({
    ...equation,
    S1: equation.S1 + 10000000000000,
    S2: equation.S2 + 10000000000000,
  })).map(resolveEquation).reduce((acc, curr) => acc + curr, 0);

  return sum.toString();
}

const resolveEquation = (equation: Equation) => {
  /*
    x1A+x2B = S1
    y1A+y2B = S2
    A = (S1 - x2B)/x1
    B = (S2 - y1A)/y2
    A = (S1 - x2(S2 - y1A)/y2)/x1
    A= S1/x1 - x2S2/(y2x1) + x2y1A/(y2x1)
    A(1 - x2y1/y2x1) = S1/x1 - x2S2/(y2x1)
    A = (S1/x1 - x2S2/(y2x1))/(1 - x2y1/y2x1)
    A = ((S1y2 - x2S2)/(y2x1))/((y2x1 - x2y1)/(y2x1))
    A = (y2S1 - x2S2)/(y2x1 - x2y1)
  */

  const A = Math.round(
    ((equation.y2 * equation.S1) - (equation.x2 * equation.S2)) /
      ((equation.y2 * equation.x1) - (equation.x2 * equation.y1)),
  );

  const B = Math.round((equation.S1 - equation.x1 * A) / equation.x2);

  if (
    A * equation.x1 + B * equation.x2 === equation.S1 &&
    A * equation.y1 + B * equation.y2 === equation.S2
  ) {
    return A * 3 + B;
  }

  return 0;
};

type Equation = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  S1: number;
  S2: number;
};

const parseInput = (input: string[]): Equation[] => {
  const regex =
    /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/gm;

  const matches = input.join("\n").matchAll(regex);

  return matches.map((match) => {
    return {
      x1: parseInt(match[1]),
      y1: parseInt(match[2]),
      x2: parseInt(match[3]),
      y2: parseInt(match[4]),
      S1: parseInt(match[5]),
      S2: parseInt(match[6]),
    };
  }).toArray();
};
