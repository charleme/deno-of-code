export function step1(input: string[]): string {
  return input
    .filter(
      (line) => isValidLine(parseLine(line)) === null,
    )
    .length
    .toString();
}

export function step2(input: string[]): string {
  return input
    .filter(
      (line) => {
        const invalidIndex = isValidLine(parseLine(line));

        if (invalidIndex === null) {
          return true;
        }

        return (invalidIndex !== 0 &&
          isValidLine(arrayWIthoutIndex(parseLine(line), invalidIndex - 1)) ===
            null) ||
          isValidLine(arrayWIthoutIndex(parseLine(line), invalidIndex)) ===
            null;
      },
    )
    .length
    .toString();
}

const arrayWIthoutIndex = (arr: number[], index: number) => {
  return arr.filter((_, i) => i !== index);
};

const parseLine = (line: string) => {
  return line.split(" ").map(Number);
};

/**
 * @return {number} index where it fails
 */
const isValidLine = (line: number[]): number | null => {
  let direction: "ASC" | "DESC" | null = null;
  let prev: number | null = null;

  for (let i = 0; i < line.length; i++) {
    const lineItem = line[i];

    if (prev !== null) {
      if (!direction) {
        direction = lineItem - prev > 0 ? "ASC" : "DESC";
      } else {
        if (direction === "ASC" && lineItem < prev) {
          return i;
        } else if (direction === "DESC" && lineItem > prev) {
          return i;
        }
      }

      if (lineItem === prev || Math.abs(lineItem - prev) > 3) {
        return i;
      }
    }

    prev = lineItem;
  }
  return null;
};
