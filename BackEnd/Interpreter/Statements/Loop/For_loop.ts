import { ForLoopStatement, NumericLiteral } from "../../../../FrontEnd/AST.ts";
import Environment from "../../../Scope/environment.ts";
import { MAKE_NUll, MAKE_NUM, NumberVal, RuntimeVal } from "../../../values.ts";
import { evaluate } from "../../interpreter.ts";

/**
 * Evaluates a for loop statement.
 * @param stmt The for loop statement to evaluate.
 * @param env The environment in which to evaluate the statement.
 * @returns The result of evaluating the for loop statement.
 * @throws {Error} If the loop control variables are not numeric.
 */
export const evaluate_for_loop_statement = (
  stmt: ForLoopStatement,
  env: Environment,
): RuntimeVal => {
  const start = evaluate(stmt.start, env) as NumberVal;
  const end = evaluate(stmt.end, env) as NumberVal;
  let step: NumberVal;
  if (stmt.step === undefined) {
    step = { value: 1, type: "number" };
  } else {
    step = evaluate(stmt.step as NumericLiteral, env) as NumberVal;
  }

  // Ensure the loop control variables are numeric
  if (
    start.type !== "number" || end.type !== "number" || step.type !== "number"
  ) {
    throw new Error("Invalid loop control variables");
  }
  if (start.value <= end.value) {
    // Iterate over the range using the start, end, and step values
    for (let i = start.value; i <= end.value; i += step.value) {
      const loopEnv = new Environment(env); // Create a new environment for each iteration

      loopEnv.declareVar(stmt.iterator, MAKE_NUM(i), false); // Declare the iterator variable

      // Evaluate the body of the loop for each iteration
      for (const bodyStmt of stmt.body) {
        if (bodyStmt.kind === "ForLoopStatement") {
          // Handle nested for loops
          evaluate_for_loop_statement(bodyStmt as ForLoopStatement, loopEnv);
        } else {
          const result = evaluate(bodyStmt, loopEnv);

          // Check if a "break" statement was executed inside the loop body
          if (result.type === "break") {
            return MAKE_NUll(); // Return null to signal the loop was exited with a break
          }
        }
      }

      // Clean up the environment for each iteration
      loopEnv.cleanUp();
    }
  } else {
    // Iterate over the range using the start, end, and step values
    for (let i = start.value; i >= end.value; i -= step.value) {
      const loopEnv = new Environment(env); // Create a new environment for each iteration

      loopEnv.declareVar(stmt.iterator, MAKE_NUM(i), false); // Declare the iterator variable

      // Evaluate the body of the loop for each iteration
      for (const bodyStmt of stmt.body) {
        if (bodyStmt.kind === "ForLoopStatement") {
          // Handle nested for loops
          evaluate_for_loop_statement(bodyStmt as ForLoopStatement, loopEnv);
        } else {
          const result = evaluate(bodyStmt, loopEnv);

          // Check if a "break" statement was executed inside the loop body
          if (result.type === "break") {
            return MAKE_NUll(); // Return null to signal the loop was exited with a break
          }
        }
      }

      // Clean up the environment for each iteration
      loopEnv.cleanUp();
    }
  }

  return MAKE_NUll(); // Return null after the loop is finished
};
