export function step1(input: string[]): string {
  const { evenIndexDigits, parsedInput } = parseInput(input[0]);
  const result: number[] = [];

  while (evenIndexDigits.length > 0) {
    for (let i = 0; i < parsedInput.length; i++) {
      const itemCount = parsedInput[i];
      for (let j = 0; j < itemCount; j++) {
        const item = i % 2 === 0
          ? evenIndexDigits.shift()
          : evenIndexDigits.pop();

        if (item === undefined) {
          break;
        }
        result.push(item);
      }
    }
  }

  return result.reduce((acc, curr, index) => {
    return acc + (curr * index);
  }, 0).toString();
}

export function step2(input: string[]): string {
  const { inputData } = parseInput(input[0]);

  const id = Math.floor((input[0].length - 1) / 2);

  for (let i = id; i > 0; i--) {
    const itemIndex = inputData.findLastIndex((item) => item.id === i);
    const item = inputData[itemIndex];
    const count = item.count;

    const emptyGroupIndex = inputData.findIndex((group) =>
      group.id === null && group.count >= count
    );
    if (emptyGroupIndex === -1) {
      continue;
    }
    const emptyGroup = inputData[emptyGroupIndex];

    if (emptyGroupIndex !== -1 && emptyGroupIndex < itemIndex) {
      inputData.splice(itemIndex, 1, { id: null, count });
      emptyGroup.count -= count;
      inputData.splice(emptyGroupIndex, 0, item);
    }
  }

  let index = 0;
  let sum = 0;
  for (let i = 0; i < inputData.length; i++) {
    const item = inputData[i];
    for (let j = 0; j < item.count; j++) {
      if (item.id !== null) {
        sum += item.id * index;
      }
      index++;
    }
  }

  return sum.toString();
}

const parseInput = (input: string) => {
  const inputArray = input.split("").map(Number);
  const evenIndexDigits = [];
  const inputData: { id: number | null; count: number }[] = [];

  for (let i = 0; i < inputArray.length; i++) {
    const inputArrayElement = inputArray[i];
    if (i % 2 === 0) {
      const id = Math.floor(i / 2);

      inputData.push({ id, count: inputArrayElement });

      for (let j = 0; j < inputArrayElement; j++) {
        evenIndexDigits.push(id);
      }
    } else {
      inputData.push({ id: null, count: inputArrayElement });
    }
  }

  return {
    evenIndexDigits,
    parsedInput: inputArray,
    inputData,
  };
};
