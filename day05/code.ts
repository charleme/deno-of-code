export function step1(input: string[]): string {
  const { rules, updates } = parseInput(input);

  return updates.filter((update) => {
    const visited = new Set<number>();

    for (const number of update) {
      const forbiddenNumbers = rules[number.toString()] ?? [];
      const hasForbidden = forbiddenNumbers.some((forbidden) =>
        visited.has(forbidden)
      );
      if (hasForbidden) {
        return false;
      }
      visited.add(number);
    }
    return true;
  }).reduce((acc, curr) => {
    return acc + curr[Math.floor(curr.length / 2)];
  }, 0)
    .toString();
}

export function step2(input: string[]): string {
  const { rules, updates } = parseInput(input);

  return updates.map((update) => {
    let visited: number[] = [];
    let hasReordered = false;

    for (const number of update) {
      const forbiddenNumbers = rules[number.toString()] ?? [];
      const newIndex = forbiddenNumbers.reduce((acc, curr) => {
        const index = visited.indexOf(curr);
        if (index !== -1 && index < acc) {
          hasReordered = true;
          return index;
        }
        return acc;
      }, visited.length);

      visited = [
        ...visited.slice(0, newIndex),
        number,
        ...visited.slice(newIndex),
      ];
    }
    return hasReordered ? visited : [0];
  }).reduce((acc, curr) => {
    return acc + curr[Math.floor(curr.length / 2)];
  }, 0)
    .toString();
}

const parseInput = (input: string[]) => {
  let i = 0;
  let isFirstPart = true;

  const rules: Record<string, number[]> = {};
  const updates: number[][] = [];

  while (i < input.length && isFirstPart) {
    const rule = input[i].split("|");
    if (rule.length > 1) {
      rules[rule[0]] = rules[rule[0]]
        ? [...rules[rule[0]], +rule[1]]
        : [+rule[1]];
    } else {
      isFirstPart = false;
    }
    i++;
  }

  while (i < input.length) {
    updates.push(input[i].split(",").map(Number));
    i++;
  }

  return { rules, updates };
};
