import { select } from "@inquirer/prompts";
import { runPlaywrightTests } from "./task1";

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

  switch (testChoice) {
    case "task1":
      console.log("Running Task 1");
      runPlaywrightTests();
      break;
    case "task2":
      console.log("Running Task 2");
      break;
    case "task3":
      console.log("Running Task 3");
      break;
    default:
      console.log("Exiting");
      process.exit(0);
  }
}

main();
