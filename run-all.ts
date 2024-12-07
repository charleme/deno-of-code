import {runAllTests} from "./utils.ts";

const start = Date.now();

const isSuccess = await runAllTests();

const duration = Date.now() - start;
console.log(`\nDuration: ${duration / 1000}s`);

if (isSuccess) {
  console.log("\nAll tests passed!");
}
