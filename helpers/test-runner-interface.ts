class TestRunnerInterface {
  tests: Test[] = [];
  private REFRESH_RATE = 80;
  interval: number | undefined = undefined;
  frameNumber = 0;

  constructor() {
    this.tests = [];
    this.REFRESH_RATE = 80;
    this.interval = undefined;
    this.frameNumber = 0;
  }

  init() {
    this.tests = [];
    const refreshDisplay = this.refreshDisplay.bind(this);
    this.interval = setInterval(
      () => {
        console.log("interval");
        refreshDisplay();
      },
      this.REFRESH_RATE,
    );
    console.log(this.interval);
  }

  addTest(test: Test) {
    this.tests.push(test);
  }

  //display the result inside the terminal
  refreshDisplay() {
    console.log("rendering");
    const encoder = new TextEncoder();
    const data = encoder.encode("Hello world");
    Deno.stdout.writeSync(data);
    this.frameNumber++;
    if (
      this.tests.length > 0 &&
      !this.tests.some((test) => test.status === "running")
    ) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    const statusIcons = {
      success: "✔",
      failed: "❌",
      running: spinnerFrames[this.frameNumber % spinnerFrames.length],
    };

    // console.clear();
    this.tests.forEach((test) => {
      const statusIcon = statusIcons[test.status];
      const duration = test.endTime
        ? `(${(test.endTime - test.startTime) / 1000}s)`
        : "";
      console.log(`${statusIcon} ${test.label} ${duration}`);
    });
  }
}

export class Test {
  status: "success" | "failed" | "running";
  startTime: number;
  endTime: number | null = null;
  label: string;

  constructor(promise: Promise<boolean>, label: string) {
    this.status = "running";
    this.startTime = Date.now();
    this.label = label;

    promise.then((result) => {
      console.log("promise resolved", result);
      this.endTime = Date.now();
      result ? this.status = "success" : this.status = "failed";
    });
  }
}

const spinnerFrames = [
  "⠋",
  "⠙",
  "⠹",
  "⠸",
  "⠼",
  "⠴",
  "⠦",
  "⠧",
  "⠇",
  "⠏",
];

export const testRunnerInterface = new TestRunnerInterface();
