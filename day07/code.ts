export function step1(input: string[]): string {
  const parsedInput = parseInput(input);

  const validLines = parsedInput.filter(({ result, values }) =>
    hasValidOperation(result, values)
  );
  return validLines.reduce((acc, { result }) => acc + result, 0).toString();
}

export function step2(input: string[]): string {
  const parsedInput = parseInput(input);

  const validLines = parsedInput.filter(({ result, values }) =>
    hasValidOperation(result, values, true)
  );
  return validLines.reduce((acc, { result }) => acc + result, 0).toString();
}

export const hasValidOperation = (
  expectedResult: number,
  values: number[],
  withConcatenation = false,
  currResult = 0,
): boolean => {
  if (values.length === 0) {
    return currResult === expectedResult;
  }

  const value = values.shift();
  if (value === undefined) {
    throw new Error("Unexpected undefined value");
  }

  return (
    hasValidOperation(
      expectedResult,
      [...values],
      withConcatenation,
      currResult + value,
    ) ||
    hasValidOperation(
      expectedResult,
      [...values],
      withConcatenation,
      currResult * value,
    ) ||
    (withConcatenation &&
      hasValidOperation(
        expectedResult,
        [...values],
        withConcatenation,
        Number(currResult.toString() + value.toString()),
      ))
  );
};

const parseInput = (input: string[]) => {
  return input.map((line) => {
    const [stringResult, rest] = line.split(": ");

    const result = Number(stringResult);
    const values = rest.split(" ").map(Number);

    return { result, values };
  });
};
