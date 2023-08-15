import { ReturnStatement, WhileStatement } from "../../../../FrontEnd/AST.ts";
import Environment from "../../../Scope/environment.ts";
import {
  BooleanVal,
  MAKE_BOOL,
  MAKE_BREAK,
  MAKE_NUll,
  NumberVal,
  RuntimeVal,
} from "../../../values.ts";
import { evaluate_return_statement } from "../../Functions/Functions.ts";
import { evaluate } from "../../interpreter.ts";

/**
 * Evaluates a boolean while statement by repeatedly executing the body as long as the condition is true.
 * @param _condition The initial condition of the while statement (not used in the evaluation).
 * @param stmt The while statement to evaluate.
 * @param env The environment in which the while statement is evaluated.
 * @returns The result of the while statement evaluation.
 */
export const evaluate_boolean_while_statement = (
  _condition: BooleanVal,
  stmt: WhileStatement,
  env: Environment,
): RuntimeVal => {
  let iterationCnt = 0;
  let evaluatedCondition = evaluate(stmt.condition, env) as BooleanVal;
  let hasBreak = false;
  while (evaluatedCondition.value && !hasBreak) {
    iterationCnt++;

    // Check for infinite loop
    if (env.checkInfiniteLoop(iterationCnt)) {
      break;
    }

    // Create a new environment for each iteration
    const whileEnv = new Environment(env);
    for (const statement of stmt.body) {
      if (statement.kind === "WhileStatement") {
        let result = evaluate_while_statement(
          statement as WhileStatement,
          whileEnv,
        );
        let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
        if (detectedReturn.value === true) {
          return result;
        }
      }
      if (statement.kind === "BreakStatement") {
        return MAKE_BREAK();
      }
      if (statement.kind === "ReturnStatement") {
        env.assignVar("hasReturn", MAKE_BOOL(true));
        const result = evaluate_return_statement(
          statement as ReturnStatement,
          whileEnv,
        );
        if (result === undefined) {
          return MAKE_NUll();
        }
        return result;
      }
      const result = evaluate(statement, whileEnv);
      let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
      if (detectedReturn.value === true) {
        return result;
      }
      if (result !== undefined && result.type === "break") {
        hasBreak = true;
      }
      if (hasBreak) {
        return MAKE_BREAK();
      }
    }

    whileEnv.cleanUp();

    evaluatedCondition = evaluate(stmt.condition, env) as BooleanVal;
  }

  return MAKE_NUll();
};

/**
 * Evaluates a numeric while statement by repeatedly executing the body as long as the condition is non-zero.
 * @param _condition The initial condition of the while statement (not used in the evaluation).
 * @param stmt The while statement to evaluate.
 * @param env The environment in which the while statement is evaluated.
 * @returns The result of the while statement evaluation.
 */
export const evaluate_numeric_while_statement = (
  _condition: NumberVal,
  stmt: WhileStatement,
  env: Environment,
): RuntimeVal => {
  let iterationCnt = 0;
  let hasBreak = false;
  let evaluatedCondition = evaluate(stmt.condition, env) as NumberVal;

  while (evaluatedCondition.value && !hasBreak) {
    iterationCnt++;

    // Check for infinite loop
    if (env.checkInfiniteLoop(iterationCnt)) {
      break;
    }

    // Create a new environment for each iteration
    const whileEnv = new Environment(env);
    for (const statement of stmt.body) {
      if (statement.kind === "WhileStatement") {
        let result = evaluate_while_statement(
          statement as WhileStatement,
          whileEnv,
        );
        let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
        if (detectedReturn.value === true) {
          return result;
        }
      }
      if (statement.kind === "BreakStatement") {
        return MAKE_BREAK();
      }
      if (statement.kind === "ReturnStatement") {
        env.assignVar("hasReturn", MAKE_BOOL(true));
        const result = evaluate_return_statement(
          statement as ReturnStatement,
          whileEnv,
        );
        if (result === undefined) {
          return MAKE_NUll();
        }
        return result;
      }
      const result = evaluate(statement, whileEnv);
      let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
      if (detectedReturn.value === true) {
        return result;
      }
      if (result !== undefined && result.type === "break") {
        hasBreak = true;
      }
      if (hasBreak) {
        return MAKE_BREAK();
      }
    }

    whileEnv.cleanUp();

    evaluatedCondition = evaluate(stmt.condition, env) as NumberVal;
  }

  return MAKE_NUll();
};

/**
 * Evaluates a while statement.
 * @param stmt The while statement to evaluate.
 * @param env The environment in which to evaluate the statement.
 * @returns The result of evaluating the while statement.
 * @throws {Error} If the condition in the while statement is not a boolean or numeric value.
 */
export const evaluate_while_statement = (
  stmt: WhileStatement,
  env: Environment,
): RuntimeVal => {
  const condition = evaluate(stmt.condition, env);

  switch (condition.type) {
    case "number":
      return evaluate_numeric_while_statement(
        condition as NumberVal,
        stmt,
        env,
      );
    case "boolean":
      return evaluate_boolean_while_statement(
        condition as BooleanVal,
        stmt,
        env,
      );
    default:
      throw `RunTimeError: Condition in while statement must be a boolean or numeric value`;
  }
};
