import { SwitchStatement } from "../../../../FrontEnd/AST.ts";
import Environment from "../../../Scope/environment.ts";
import { RuntimeVal,NumberVal,MAKE_NUll,StringVal } from "../../../values.ts";
import { evaluate } from "../../interpreter.ts";


/**
 * Evaluates a switch statement.
 * @param switchStmt The switch statement to evaluate.
 * @param env The environment in which to evaluate the statement.
 * @returns The result of evaluating the switch statement.
 * @throws {Error} If the switch expression is not a number or a string.
 * @throws {Error} If the switch case test is not a number (for a number switch expression) or a string (for a string switch expression).
 */
export const evaluate_switch_statement = (
  switchStmt: SwitchStatement,
  env: Environment,
): RuntimeVal => {
  const discriminant = evaluate(switchStmt.discriminant, env);
  if (discriminant.type === "number") {
    for (const switchCase of switchStmt.cases) {
      const test = evaluate(switchCase.test, env);
      if (test.type == "number") {
        const value = (test as NumberVal).value;
        const discriminant_val = (discriminant as NumberVal).value;
        if (value === discriminant_val) {
          const switchEnv = new Environment(env); // Create a new environment for the switch statement
          for (const consequent of switchCase.consequent) {
            if (consequent.kind === "BreakStatement") {
              return MAKE_NUll();
            } else {
              const result = evaluate(consequent, switchEnv);
              if (result.type === "break") {
                return MAKE_NUll();
              }
            }
          }
          return MAKE_NUll(); // Exit the switch statement
        }
        // Evaluate the default case if no matching case is found
      } else {
        throw "Expected Number in switch case as in switch(expression) expression is of type number";
      }
    }
    for (const consequent of switchStmt.default) {
      if (consequent.kind === "BreakStatement") {
        return MAKE_NUll();
      } else {
        const result = evaluate(consequent, env);
        if (result.type === "break") {
          return MAKE_NUll();
        }
      }
    }
  } else if (discriminant.type === "string") {
    for (const switchCase of switchStmt.cases) {
      const test = evaluate(switchCase.test, env);
      if (test.type == "string") {
        const value = (test as StringVal).value;
        const discriminant_val = (discriminant as StringVal).value;
        if (value === discriminant_val) {
          const switchEnv = new Environment(env); // Create a new environment for the switch statement
          for (const consequent of switchCase.consequent) {
            if (consequent.kind === "BreakStatement") {
              return MAKE_NUll();
            } else {
              const result = evaluate(consequent, switchEnv);
              if (result.type === "break") {
                return MAKE_NUll();
              }
              return result; // Return the value of the evaluated consequent
            }
          }
          return MAKE_NUll(); // Exit the switch statement
        }
        // Evaluate the default case if no matching case is found
      } else {
        throw "Expected string in switch case as in switch(expression) expression is of type string";
      }
    }
    for (const consequent of switchStmt.default) {
      if (consequent.kind === "BreakStatement") {
        return MAKE_NUll();
      } else {
        const result = evaluate(consequent, env);
        if (result.type === "break") {
          return MAKE_NUll();
        }
        return result; // Return the value of the evaluated consequent
      }
    }
  }
  return MAKE_NUll();
};
