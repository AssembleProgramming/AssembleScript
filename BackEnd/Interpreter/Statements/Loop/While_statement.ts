import { WhileStatement } from "../../../../FrontEnd/AST.ts";
import Environment from "../../../Scope/environment.ts";
import {
  BooleanVal,
  MAKE_NUll,
  NumberVal,
  RuntimeVal,
} from "../../../values.ts";
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
  let breakLoop = false;
  let evaluatedCondition = evaluate(stmt.condition, env) as BooleanVal;
  const startTime = performance.now();

  while (evaluatedCondition.value && !breakLoop) {
    iterationCnt++;

    // Check for infinite loop
    if (env.checkInfiniteLoop(iterationCnt)) {
      break;
    }

    // Create a new environment for each iteration
    const whileEnv = new Environment(env);
    for (const statement of stmt.body) {
      if (statement.kind === "BreakStatement") {
        breakLoop = true;
        break;
      }

      const evaluatedStatement = evaluate(statement, whileEnv);
      if (evaluatedStatement.type === "break") {
        breakLoop = true;
        break;
      }
    }

    whileEnv.cleanUp(); // Clean up the variables defined within the loop body

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
  let breakLoop = false;
  let evaluatedCondition = evaluate(stmt.condition, env) as NumberVal;

  while (evaluatedCondition.value && !breakLoop) {
    iterationCnt++;

    // Check for infinite loop
    if (env.checkInfiniteLoop(iterationCnt)) {
      break;
    }

    // Create a new environment for each iteration
    const whileEnv = new Environment(env);
    for (const statement of stmt.body) {
      if (statement.kind === "BreakStatement") {
        breakLoop = true;
        break;
      }

      const evaluatedStatement = evaluate(statement, whileEnv);
      if (evaluatedStatement.type === "break") {
        breakLoop = true;
        break;
      }
    }

    whileEnv.cleanUp(); // Clean up the variables defined within the loop body

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
      throw new Error(
        "Condition in while statement must be a boolean or numeric value",
      );
  }
};
