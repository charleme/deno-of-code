import {runLastDayTests} from "./utils.ts";

const handleSuccess = () => {
  console.log("\nAll tests passed!");
  Deno.exit(0);
};

const handleFailedTest = () => {
  Deno.exit(1);
};

runLastDayTests().then((res) => {
  if (res) {
    return handleSuccess();
  }
  return handleFailedTest();
}).catch((err) => {
  console.error({ err });
  handleFailedTest();
});
