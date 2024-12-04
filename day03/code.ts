export function step1(input: string[]): string {
  const parsedInput = parseInput(input);
  let sum = 0;
  const matches = parsedInput.matchAll(multRegex);

  for (const match of matches) {
    sum += parseInt(match[1]) * parseInt(match[2]);
  }

  return sum.toString();
}

export function step2(input: string[]): string {
  const parsedInput = parseInput(input);
  let sum = 0;
  let isActive = true;
  const matches = parsedInput.matchAll(mult2Regex);

  for (const match of matches) {
    if (match[0] === "do()") {
      isActive = true;
      continue;
    }
    if (match[0] === "don't()") {
      isActive = false;
      continue;
    }

    if (!isActive) {
      continue;
    }

    sum += parseInt(match[2]) * parseInt(match[3]);
  }

  return sum.toString();
}

const parseInput = (input: string[]) => {
  return input.join("");
};

const multRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;
const mult2Regex = /(mul\((\d{1,3}),(\d{1,3})\))|(do\(\))|don't\(\)/g;
