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

  try {
    const [inputContent, outputContent] = await Promise.all([
      await Deno.readTextFile(input),
      await Deno.readTextFile(output),
    ]);
    const inputLines = inputContent.split(/\r?\n/g);
    const outputLines = outputContent;

    const startTime = Date.now();

    const result = resolver(inputLines);

    const duration = Date.now() - startTime;

    const isSuccess = result === outputLines;

    const icon = isSuccess ? "\x1b[32m✔\x1b[0m" : "\x1b[31m❌\x1b[0m";
    const suffix = isSuccess ? "passed" : "failed";
    console.log(
      `${icon} Day ${day}, Step ${step}: Test ${testNumber + 1} ${suffix}`,
    );
    console.log(
      `\tExpected: ${outputLines}, Got: ${result}, Duration: ${duration}ms\n`,
    );

    return isSuccess;
  } catch (error: unknown) {
    // consider if there is no test file, it's a success
    if (error instanceof Deno.errors.NotFound) {
      return true;
    }
    throw error;
  }
};

export const runDayTests = async (day: number, step: 1 | 2) => {
  const { [`step${step}`]: resolver, ...rest } = await import(
    "./" + getDayCodeFilePath(day)
  ).catch((_) => false);
  if (!resolver) {
    // consider if there is no test file, it's a success
    return true;
  }

  const parsedResolver = v.parse(resolverSchema, resolver);

  for (let i = 0; i < 100; i++) {
    if (!await runTest(day, step, i, parsedResolver)) {
      return false;
    }
  }

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
  for (let i = 1; i <= 25; i++) {
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
