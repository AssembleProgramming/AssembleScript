import { ReturnStatement, SwitchStatement } from "../../../../FrontEnd/AST.ts";
import Environment from "../../../Scope/environment.ts";
import {
  BooleanVal,
  MAKE_BOOL,
  MAKE_BREAK,
  MAKE_NUll,
  NumberVal,
  RuntimeVal,
  StringVal,
} from "../../../values.ts";
import { evaluate, evaluate_return_statement } from "../../interpreter.ts";

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
    const switchEnv = new Environment(env); // Create a new environment for the switch statement
    for (const switchCase of switchStmt.cases) {
      const test = evaluate(switchCase.test, env);
      if (test.type === "number") {
        const value = (test as NumberVal).value;
        const discriminant_val = (discriminant as NumberVal).value;
        if (value === discriminant_val) {
          for (const consequent of switchCase.consequent) {
            if (consequent.kind === "BreakStatement") {
              return MAKE_BREAK();
            } else {
              if (consequent.kind === "ReturnStatement") {
                env.assignVar("hasReturn", MAKE_BOOL(true));
                const result = evaluate_return_statement(
                  consequent as ReturnStatement,
                  switchEnv,
                );
                if (result === undefined) {
                  return MAKE_NUll();
                }
                return result;
              } else {
                let result = evaluate(consequent, switchEnv);
                let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
                if (detectedReturn.value === true) {
                  return result;
                } else {
                  continue;
                }
              }
            }
          }
          return MAKE_NUll(); // Exit the switch statement
        }
        // Evaluate the default case if no matching case is found
      } else {
        throw `RunTimeError: Expected Number in multiverse madness, as in multiverse(expression) the expression is of type number`;
      }
    }
    for (const consequent of switchStmt.default) {
      if (consequent.kind === "BreakStatement") {
        return MAKE_BREAK();
      } else {
        if (consequent.kind === "ReturnStatement") {
          env.assignVar("hasReturn", MAKE_BOOL(true));
          const result = evaluate_return_statement(
            consequent as ReturnStatement,
            switchEnv,
          );
          if (result === undefined) {
            return MAKE_NUll();
          }
          return result;
        } else {
          let result = evaluate(consequent, switchEnv);
          let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
          if (detectedReturn.value === true) {
            return result;
          } else {
            continue;
          }
        }
      }
    }
  } else if (discriminant.type === "string") {
    const switchEnv = new Environment(env); // Create a new environment for the switch statement
    for (const switchCase of switchStmt.cases) {
      const test = evaluate(switchCase.test, env);
      if (test.type === "string") {
        const value = (test as StringVal).value;
        const discriminant_val = (discriminant as StringVal).value;
        if (value === discriminant_val) {
          for (const consequent of switchCase.consequent) {
            if (consequent.kind === "BreakStatement") {
              return MAKE_BREAK();
            } else {
              if (consequent.kind === "ReturnStatement") {
                env.assignVar("hasReturn", MAKE_BOOL(true));
                const result = evaluate_return_statement(
                  consequent as ReturnStatement,
                  switchEnv,
                );
                if (result === undefined) {
                  return MAKE_NUll();
                }
                return result;
              } else {
                let result = evaluate(consequent, switchEnv);
                let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
                if (detectedReturn.value === true) {
                  return result;
                } else {
                  continue;
                }
              }
            }
          }
          return MAKE_NUll(); // Exit the switch statement
        }
        // Evaluate the default case if no matching case is found
      } else {
        throw `Expected String in multiverse madness, as in multiverse(expression) the expression is of type String`;
      }
    }
    for (const consequent of switchStmt.default) {
      if (consequent.kind === "BreakStatement") {
        return MAKE_BREAK();
      } else {
        if (consequent.kind === "ReturnStatement") {
          env.assignVar("hasReturn", MAKE_BOOL(true));
          const result = evaluate_return_statement(
            consequent as ReturnStatement,
            switchEnv,
          );
          if (result === undefined) {
            return MAKE_NUll();
          }
          return result;
        } else {
          let result = evaluate(consequent, switchEnv);
          let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
          if (detectedReturn.value === true) {
            return result;
          } else {
            continue;
          }
        }
      }
    }
  }
  return MAKE_NUll();
};
