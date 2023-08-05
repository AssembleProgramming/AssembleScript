import {
  ForEachLoopStatement,
  NumericLiteral,
  ReturnStatement,
  WakandaForStatement,
} from "../../../../FrontEnd/AST.ts";
import Environment from "../../../Scope/environment.ts";
import {
  BooleanVal,
  MAKE_BOOL,
  MAKE_BREAK,
  MAKE_NUll,
  MAKE_NUM,
  NumberVal,
  RuntimeVal,
} from "../../../values.ts";
import { evaluate, evaluate_return_statement } from "../../interpreter.ts";

/**
 * Evaluates a for loop statement.
 * @param stmt The for loop statement to evaluate.
 * @param env The environment in which to evaluate the statement.
 * @returns The result of evaluating the for loop statement.
 * @throws {Error} If the loop control variables are not numeric.
 */
export const evaluate_for_each_loop_statement = (
  stmt: ForEachLoopStatement,
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
  if (step.value <= 0) {
    throw `RunTimeError: The step value in wakandaForEach must be a positive non-zero value`;
  }
  // Ensure the loop control variables are numeric
  if (
    start.type !== "number" ||
    end.type !== "number" ||
    step.type !== "number"
  ) {
    throw `RunTimeError: Invalid loop control variables`;
  }
  if (start.value <= end.value) {
    // Iterate over the range using the start, end, and step values
    for (let i = start.value; i <= end.value; i += step.value) {
      const loopEnv = new Environment(env); // Create a new environment for each iteration

      loopEnv.declareVar(stmt.iterator, MAKE_NUM(i), false); // Declare the iterator variable

      // Evaluate the body of the loop for each iteration
      for (const bodyStmt of stmt.body) {
        if (bodyStmt.kind === "ForEachLoopStatement") {
          // Handle nested for loops
          let result = evaluate_for_each_loop_statement(
            bodyStmt as ForEachLoopStatement,
            loopEnv,
          );
          let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
          if (detectedReturn.value === true) {
            return result;
          } else {
            continue;
          }
        } else if (bodyStmt.kind === "BreakStatement") {
          return MAKE_NUll();
        } else {
          if (bodyStmt.kind === "ReturnStatement") {
            env.assignVar("hasReturn", MAKE_BOOL(true));
            const result = evaluate_return_statement(
              bodyStmt as ReturnStatement,
              loopEnv,
            );
            if (result === undefined) {
              return MAKE_NUll();
            }
            return result;
          } else {
            const result = evaluate(bodyStmt, loopEnv);

            let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
            if (detectedReturn.value === true) {
              return result;
            } else {
              if (result !== undefined) {
                if (result.type === "break") {
                  break;
                } else {
                  continue;
                }
              }
            }
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
        if (bodyStmt.kind === "ForEachLoopStatement") {
          // Handle nested for loops
          let result = evaluate_for_each_loop_statement(
            bodyStmt as ForEachLoopStatement,
            loopEnv,
          );
          let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
          if (detectedReturn.value === true) {
            return result;
          } else {
            continue;
          }
        } else {
          if (bodyStmt.kind === "BreakStatement") {
            return MAKE_NUll();
          }
          if (bodyStmt.kind === "ReturnStatement") {
            env.assignVar("hasReturn", MAKE_BOOL(true));
            const result = evaluate_return_statement(
              bodyStmt as ReturnStatement,
              loopEnv,
            );
            if (result === undefined) {
              return MAKE_NUll();
            }
            return result;
          } else {
            const result = evaluate(bodyStmt, loopEnv);
            let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
            if (detectedReturn.value === true) {
              return result;
            } else {
              if (result !== undefined) {
                if (result.type === "break") {
                  break;
                } else {
                  continue;
                }
              }
            }
          }
        }
      }

      // Clean up the environment for each iteration
      loopEnv.cleanUp();
    }
  }

  return MAKE_NUll(); // Return null after the loop is finished
};

/**
 * 
 * @param stmt Evaluates a for statement.
 * @param env 
 * @param wakandaForEnv 
 * @returns 
 */
export const evaluate_numeric_wakandaFor_loop_statement = (
  stmt: WakandaForStatement,
  env: Environment,
  wakandaForEnv: Environment,
): RuntimeVal => {
  let iterationCnt = 0;
  let hasBreak = false;
  let evaluatedCondition = evaluate(
    stmt.condition,
    wakandaForEnv,
  ) as NumberVal;
  while (evaluatedCondition.value && !hasBreak) {
    iterationCnt++;

    // Check for infinite loop
    if (env.checkInfiniteLoop(iterationCnt)) {
      break;
    }
    for (const statement of stmt.body) {
      if (statement.kind === "WakandaForStatement") {
        let result = evaluate_wakandaFor_loop_statement(
          statement as WakandaForStatement,
          wakandaForEnv,
        );
        let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
        if (detectedReturn.value === true) {
          return result;
        } else {
          continue;
        }
      } else {
        if (statement.kind === "BreakStatement") {
          return MAKE_BREAK();
        }
        if (statement.kind === "ReturnStatement") {
          env.assignVar("hasReturn", MAKE_BOOL(true));
          const result = evaluate_return_statement(
            statement as ReturnStatement,
            wakandaForEnv,
          );
          if (result === undefined) {
            return MAKE_NUll();
          }
          return result;
        } else {
          const result = evaluate(statement, wakandaForEnv);
          let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
          if (detectedReturn.value === true) {
            return result;
          } else {
            if (result !== undefined) {
              if (result.type === "break") {
                hasBreak = true;
              }
            }
          }
        }
      }
      if (hasBreak) {
        return MAKE_BREAK();
      }
    }
    evaluate(stmt.modification, wakandaForEnv);
    evaluatedCondition = evaluate(stmt.condition, wakandaForEnv) as NumberVal;
  }

  return MAKE_NUll();
};

/**
 * 
 * @param stmt Evaluates a for statement.
 * @param env 
 * @param wakandaForEnv 
 * @returns 
 */
export const evaluate_boolean_wakandaFor_loop_statement = (
  stmt: WakandaForStatement,
  env: Environment,
  wakandaForEnv: Environment,
): RuntimeVal => {
  let iterationCnt = 0;
  let hasBreak = false;
  let evaluatedCondition = evaluate(
    stmt.condition,
    wakandaForEnv,
  ) as BooleanVal;
  while (evaluatedCondition.value && !hasBreak) {
    iterationCnt++;

    // Check for infinite loop
    if (env.checkInfiniteLoop(iterationCnt)) {
      break;
    }
    for (const statement of stmt.body) {
      if (statement.kind === "WakandaForStatement") {
        let result = evaluate_wakandaFor_loop_statement(
          statement as WakandaForStatement,
          wakandaForEnv,
        );
        let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
        if (detectedReturn.value === true) {
          return result;
        } else {
          continue;
        }
      } else {
        if (statement.kind === "BreakStatement") {
          return MAKE_BREAK();
        }
        if (statement.kind === "ReturnStatement") {
          env.assignVar("hasReturn", MAKE_BOOL(true));
          const result = evaluate_return_statement(
            statement as ReturnStatement,
            wakandaForEnv,
          );
          if (result === undefined) {
            return MAKE_NUll();
          }
          return result;
        } else {
          const result = evaluate(statement, wakandaForEnv);
          let detectedReturn = env.lookupVar("hasReturn") as BooleanVal;
          if (detectedReturn.value === true) {
            return result;
          } else {
            if (result !== undefined) {
              if (result.type === "break") {
                hasBreak = true;
              }
            }
          }
        }
      }
      if (hasBreak) {
        return MAKE_BREAK();
      }
    }
    evaluate(stmt.modification, wakandaForEnv);
    evaluatedCondition = evaluate(stmt.condition, wakandaForEnv) as BooleanVal;
  }

  return MAKE_NUll();
};

/**
 * Evaluates a for loop statement.
 * @param stmt The for loop statement to evaluate.
 * @param env The environment in which to evaluate the statement.
 * @returns The result of evaluating the for loop statement.
 * @throws {Error} If the loop control variables are not numeric.
 */
export const evaluate_wakandaFor_loop_statement = (
  stmt: WakandaForStatement,
  env: Environment,
): RuntimeVal => {
  const wakandaForEnv = new Environment(env);
  const initialization = evaluate(stmt.initialization, wakandaForEnv);
  const condition = evaluate(stmt.condition, wakandaForEnv);
  switch (condition.type) {
    case "number":
      return evaluate_numeric_wakandaFor_loop_statement(
        stmt,
        env,
        wakandaForEnv,
      );
    case "boolean":
      return evaluate_boolean_wakandaFor_loop_statement(
        stmt,
        env,
        wakandaForEnv,
      );
    default:
      throw `RunTimeError: Condition in 'wakandaFor' statement must be a boolean or numeric value`;
  }
};
