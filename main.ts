import { evaluate } from "./BackEnd/Interpreter/interpreter.ts";
import { setupGlobalScope } from "./BackEnd/Scope/globalScope.ts";
import Parser from "./FrontEnd/Parser.ts";

/**
 * @param inputFile : User program
 */
async function __run(inputFile: string) {
  const parser = new Parser();
  const env = setupGlobalScope();

  const input = await Deno.readTextFile(inputFile);
  const program = parser.produceAST(input);
  evaluate(program, env);
}
__run("./test.txt");
/**
 * Initializes the script execution.
 */
function __interpret() {
  const parser = new Parser();
  const env = setupGlobalScope();

  // Start the interactive loop
  console.log("\n\n$ RunningV0.1");
  while (true) {
    const input = prompt("🛡️ avengeScript>>> :");

    // Check for no user input or exit keyword
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    // Parse the input to produce the Abstract Syntax Tree (AST)
    const program = parser.produceAST(input);
    // console.log(program);

    // Evaluate the AST and get the result
    evaluate(program, env);
  }
}

// Call the initialization function to start the script execution
// __interpret();
