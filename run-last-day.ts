import {runLastDayTests} from "./utils.ts";

const start = Date.now();

const isSuccess = await runLastDayTests();

const duration = Date.now() - start;
console.log(`\nDuration: ${duration / 1000}s`);

if (isSuccess) {
  console.log("\nAll tests passed!");
}
