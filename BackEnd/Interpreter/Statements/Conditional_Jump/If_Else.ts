import {
  ElseStatement,
  IfStatement,
  ReturnStatement,
} from "../../../../FrontEnd/AST.ts";
import Environment from "../../../Scope/environment.ts";
import {
  BooleanVal,
  MAKE_BOOL,
  MAKE_BREAK,
  MAKE_NUll,
  NumberVal,
  RuntimeVal,
} from "../../../values.ts";
import { evaluate, evaluate_return_statement } from "../../interpreter.ts";

/**
 * Evaluates a numeric if statement by conditionally executing the body based on the condition value.
 * @param condition The condition to evaluate.
 * @param stmt The if statement to evaluate.
 * @param env The environment in which the if statement is evaluated.
 * @returns The result of the if statement evaluation.
 */
export const evaluate_numeric_if_statement = (
  condition: NumberVal,
  stmt: IfStatement,
  env: Environment,
): RuntimeVal => {
  if (condition.value) {
    // Evaluate the body of the if statement in a new environment
    const ifEnv = new Environment(env);
    for (const bodyStmt of stmt.body) {
      if (bodyStmt.kind === "BreakStatement") {
        return MAKE_BREAK();
      } else {
        if (bodyStmt.kind === "ReturnStatement") {
          env.assignVar("hasReturn", MAKE_BOOL(true));
          const result = evaluate_return_statement(
            bodyStmt as ReturnStatement,
            ifEnv,
          );
          if (result === undefined) {
            return MAKE_NUll();
          }
          return result;
        } else {
          let result = evaluate(bodyStmt, ifEnv);
          let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
          if (detectedReturn.value === true) {
            return result;
          } else {
            continue;
          }
        }
      }
    }
    return MAKE_NUll();
  } else if (stmt.elseBranch) {
    if (stmt.elseBranch.kind === "IfStatement") {
      // Evaluate the else if statement recursively in a new environment
      const elseIfEnv = new Environment(env);
      let result = evaluate_if_statement(stmt.elseBranch, elseIfEnv);
      let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
      if (detectedReturn.value === true) {
        return result;
      }
    } else if (stmt.elseBranch.kind === "ElseStatement") {
      // Evaluate the body of the else statement in a new environment
      const elseEnv = new Environment(env);
      for (const bodyStmt of stmt.elseBranch.body) {
        if (bodyStmt.kind === "BreakStatement") {
          return MAKE_BREAK();
        } else {
          if (bodyStmt.kind === "ReturnStatement") {
            env.assignVar("hasReturn", MAKE_BOOL(true));
            const result = evaluate_return_statement(
              bodyStmt as ReturnStatement,
              elseEnv,
            );
            if (result === undefined) {
              return MAKE_NUll();
            }
            return result;
          } else {
            let result = evaluate(bodyStmt, elseEnv);
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
  }
  return MAKE_NUll();
};

/**
 * Evaluates a boolean if statement by conditionally executing the body based on the condition value.
 * @param condition The condition to evaluate.
 * @param stmt The if statement to evaluate.
 * @param env The environment in which the if statement is evaluated.
 * @returns The result of the if statement evaluation.
 */
export const evaluate_boolean_if_statement = (
  condition: BooleanVal,
  stmt: IfStatement,
  env: Environment,
): RuntimeVal => {
  if (condition.value) {
    // Evaluate the body of the if statement in a new environment
    const ifEnv = new Environment(env);
    for (const bodyStmt of stmt.body) {
      if (bodyStmt.kind === "BreakStatement") {
        return MAKE_BREAK();
      } else {
        if (bodyStmt.kind === "ReturnStatement") {
          env.assignVar("hasReturn", MAKE_BOOL(true));
          let result = evaluate_return_statement(
            bodyStmt as ReturnStatement,
            ifEnv,
          );
          if (result === undefined) {
            return MAKE_NUll();
          }
          return result;
        } else {
          let result = evaluate(bodyStmt, ifEnv);
          let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
          if (detectedReturn.value === true) {
            return result;
          } else {
            continue;
          }
        }
      }
    }
  } else if (stmt.elseBranch) {
    if (stmt.elseBranch.kind === "IfStatement") {
      // Evaluate the else if statement recursively in a new environment
      const elseIfEnv = new Environment(env);
      let result = evaluate_if_statement(stmt.elseBranch, elseIfEnv);
      let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
      if (detectedReturn.value === true) {
        return result;
      }
    } else if (stmt.elseBranch.kind === "ElseStatement") {
      // Evaluate the body of the else statement in a new environment
      const elseEnv = new Environment(env);
      for (const bodyStmt of stmt.elseBranch.body) {
        if (bodyStmt.kind === "BreakStatement") {
          return MAKE_BREAK();
        } else {
          if (bodyStmt.kind === "ReturnStatement") {
            env.assignVar("hasReturn", MAKE_BOOL(true));
            const result = evaluate_return_statement(
              bodyStmt as ReturnStatement,
              elseEnv,
            );
            if (result === undefined) {
              return MAKE_NUll();
            }
            return result;
          } else {
            let result = evaluate(bodyStmt, elseEnv);
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
  }
  return MAKE_NUll();
};

/**
 * Evaluates an if statement by evaluating the condition expression and executing the corresponding branch based on the result.
 * @param stmt - The if statement to evaluate.
 * @param env - The environment for variable lookup.
 * @returns The runtime value of the evaluated if statement.
 */
export const evaluate_if_statement = (
  stmt: IfStatement,
  env: Environment,
): RuntimeVal => {
  const condition = evaluate(stmt.condition, env);

  switch (condition.type) {
    case "number":
      return evaluate_numeric_if_statement(condition as NumberVal, stmt, env);
    case "boolean":
      return evaluate_boolean_if_statement(condition as BooleanVal, stmt, env);
    default:
      throw new Error(
        "Condition in if statement must be a boolean or integer value",
      );
  }
};

/**
 * Evaluates an else statement by executing the body of the else statement.
 * @param stmt The else statement to evaluate.
 * @param env The environment in which the else statement is evaluated.
 * @returns The result of the else statement evaluation.
 */
export const evaluate_else_statement = (
  stmt: ElseStatement,
  env: Environment,
): RuntimeVal => {
  for (const bodyStmt of stmt.body) {
    evaluate(bodyStmt, env);
  }

  return MAKE_NUll();
};
