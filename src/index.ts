import { select } from "@inquirer/prompts";
import { delay } from "./lib/utils";
import runPlaywrightTests from "./task1";
import runTask2 from "./task2";

async function main() {
  const testChoice = await select({
    message: "What task would you like to run?",
    choices: [
      { name: "Task 1 - Test On Sale Badge with Playwright", value: "task1" },
      {
        name: "Task 2 - Get last 30days orders with specific product",
        value: "task2",
      },
      {
        name: "Task 3 - Decrease product price and send email",
        value: "task3",
      },
      { name: "Exit", value: "exit" },
    ],
  });

  try {
    switch (testChoice) {
      case "task1":
        console.log("Running Task 1");
        await runPlaywrightTests();
        break;
      case "task2":
        console.log("Running Task 2");
        await runTask2();
        break;
      case "task3":
        console.log("Running Task 3");
        break;
      default:
        console.log("Exiting");
        process.exit(0);
    }
  } catch (error) {
    console.log(error);
  }
  // restart from start
  await delay(1000);
  main();
}

main();
