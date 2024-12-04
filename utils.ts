import * as v from "@valibot/valibot";

const PREFIXE_FICHIER_INPUT = "input";
const PREFIXE_FICHIER_OUTPUT = "output";

function getDayFolder(day: number) {
  return `day${day.toString().padStart(2, "0")}`;
}

function getTestFilePaths(day: number, number: number, step: 1 | 2) {
  const formatNumber = number.toString().padStart(2, "0");
  const dayFolder = getDayFolder(day);
  return {
    input:
      `${dayFolder}/tests/step${step}/${PREFIXE_FICHIER_INPUT}${formatNumber}.txt`,
    output:
      `${dayFolder}/tests/step${step}/${PREFIXE_FICHIER_OUTPUT}${formatNumber}.txt`,
  };
}

function getDayCodeFilePath(day: number) {
  return `${getDayFolder(day)}/code.ts`;
}

const getTestCount = (day: number, step: 1 | 2): number => {
  let count = 0;
  try {
    while (
      count < 50 &&
      Deno.statSync(getTestFilePaths(day, count + 1, step).input).isFile
    ) {
      count++;
    }
  } catch (_) {
    return count;
  }
  return count;
};

const getLastDayNumber = () => {
  let count = 1;
  try {
    while (
      count < 50 && Deno.statSync(getDayFolder(count)).isDirectory
    ) {
      count++;
    }
  } catch (_) {
    return count - 1;
  }
  return count - 1;
};

const runDayTests = async (day: number, step: 1 | 2) => {
  const testCount = getTestCount(day, step);

  for (let i = 0; i < testCount; i++) {
    const { input, output } = getTestFilePaths(day, i + 1, step);
    const inputContent = Deno.readTextFileSync(input);
    const outputContent = Deno.readTextFileSync(output);

    const inputLines = inputContent.split(/\r?\n/g);
    const outputLines = outputContent;

    const { [`step${step}`]: codeFunction } = await import(
      "./" + getDayCodeFilePath(day)
    );
    const codeSchema = v.pipe(
      v.function(),
      v.args(v.tuple([v.array(v.string())])),
      v.returns(v.string()),
    );

    const parsedCode = v.parse(codeSchema, codeFunction);

    const result = parsedCode(inputLines);

    console.log(`Expected: ${outputLines}`);
    console.log(`Got: ${result}`);
    if (result !== outputLines) {
      console.log(
        `Day ${day}, Step ${step}: Test ${i + 1}/${testCount} failed`,
      );

      return false;
    }
    console.log(
      `Day ${day}, Step ${step}: Test ${i + 1}/${testCount} passed\n`,
    );
  }
  console.log(`Day ${day}, Step ${step}: All tests passed\n`);

  return true;
};

const runLastDayTests = async () => {
  const lastDay = getLastDayNumber();

  const step1Result = await runDayTests(lastDay, 1);
  if (!step1Result) {
    return false;
  }
  return await runDayTests(lastDay, 2);
};

const runAllTests = async () => {
  const lastDay = getLastDayNumber();
  for (let i = 1; i <= lastDay; i++) {
    if (!await runDayTests(i, 1)) {
      return false;
    }
    if (!await runDayTests(i, 2)) {
      return false;
    }
  }
  return true;
};

export { getLastDayNumber, runAllTests, runLastDayTests };
