import * as v from "@valibot/valibot";
import {Test, testRunnerInterface} from "./helpers/test-runner-interface.ts";

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

const resolverSchema = v.pipe(
  v.function(),
  v.args(v.tuple([v.array(v.string())])),
  v.returns(v.string()),
);

type Resolver = v.InferOutput<typeof resolverSchema>;

const runTest = async (
  day: number,
  step: 1 | 2,
  testNumber: number,
  resolver: Resolver,
) => {
  const { input, output } = getTestFilePaths(day, testNumber + 1, step);
  const [inputContent, outputContent] = await Promise.all([
    await Deno.readTextFile(input),
    await Deno.readTextFile(output),
  ]);

  const inputLines = inputContent.split(/\r?\n/g);
  const outputLines = outputContent;

  const result = resolver(inputLines);

  // console.log(`Expected: ${outputLines}`);
  // console.log(`Got: ${result}`);
  return result === outputLines;
  // if (result !== outputLines) {
  //   console.log(
  //     `Day ${day}, Step ${step}: Test ${testNumber + 1} failed`,
  //   );
  //
  //   return false;
  // }
  // console.log(
  //   `Day ${day}, Step ${step}: Test ${testNumber + 1} passed\n`,
  // );
  // return true;
};

const runDayTests = async (day: number, step: 1 | 2) => {
  const testCount = getTestCount(day, step);
  const promises = [];

  const { [`step${step}`]: resolver } = await import(
    "./" + getDayCodeFilePath(day)
  );

  const parsedResolver = v.parse(resolverSchema, resolver);

  for (let i = 0; i < testCount; i++) {
    const promise = runTest(day, step, i, parsedResolver);
    testRunnerInterface.addTest(
      new Test(promise, `Day ${day}, Step ${step}: Test ${i + 1}`),
    );

    promises.push(promise);
  }
  // console.log(`Day ${day}, Step ${step}: All tests passed\n`);

  const results = await Promise.all(promises);

  return results.every((result) => result);
};

const runLastDayTests = async () => {
  testRunnerInterface.init();
  const lastDay = getLastDayNumber();

  const step1Result = await runDayTests(lastDay, 1);
  if (!step1Result) {
    return false;
  }
  return await runDayTests(lastDay, 2);
};

const runAllTests = async () => {
  testRunnerInterface.init();
  const lastDay = getLastDayNumber();
  const promises = [];

  for (let i = 1; i <= lastDay; i++) {
    promises.push(runDayTests(i, 1));
    promises.push(runDayTests(i, 2));
  }

  const results = await Promise.all(promises);

  return results.every((result) => result);
};

export { getLastDayNumber, runAllTests, runLastDayTests };
