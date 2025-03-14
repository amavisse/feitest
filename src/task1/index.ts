import { spawn } from "child_process";

export default async function runPlaywrightTests() {
  return new Promise((resolve, reject) => {
    const playwrightProcess = spawn("npx", ["playwright", "test", "--headed"], {
      stdio: "inherit",
      shell: true,
    });
    playwrightProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Playwright tests completed successfully.");
      } else {
        console.error(`Playwright tests failed with code ${code}`);
      }
      resolve(() => {});
    });
  });
}
