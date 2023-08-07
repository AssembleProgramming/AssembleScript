import {
  CallExpr,
  FunctionDefinition,
  Identifier,
  ReturnStatement,
} from "../../../FrontEnd/AST.ts";
import Environment from "../../Scope/environment.ts";
import {
  BooleanVal,
  FunctionVal,
  MAKE_BOOL,
  MAKE_FUNCTION,
  MAKE_NUll,
  NativeFnVal,
  RuntimeVal,
} from "../../values.ts";
import { evaluate } from "../interpreter.ts";

/**
 * Evaluates a function definition statement.
 * @param funcDef - The function definition statement.
 * @param env - The environment for variable lookup.
 * @returns The evaluated value of the function definition.
 */
export const evaluate_function_definition = (
  funcDef: FunctionDefinition,
  env: Environment,
): RuntimeVal => {
  // Create a new environment that captures the current environment as the closure
  const functionEnv = new Environment(env);

  // Create the function value and store it in the current environment
  const funcValue = MAKE_FUNCTION(
    funcDef.params.map((param) => param.name),
    funcDef.body,
    functionEnv, // Pass the closure environment to the function value
  );

  env.declareVar(funcDef.name, funcValue, false);
  return funcValue;
};

/**
 * Evaluates a call expression by invoking a function with the provided arguments.
 * @param expr The call expression to evaluate.
 * @param env The environment in which the expression is evaluated.
 * @returns The result of the function call.
 * @throws Error if the value being called is not a function.
 */
export const evaluate_call_expression = (
  expr: CallExpr,
  env: Environment,
): RuntimeVal => {
  const args = expr.args.map((arg) => evaluate(arg, env));
  const fn = evaluate(expr.caller, env);

  if (fn.type === "native-fn") {
    const result = (fn as NativeFnVal).call(args, env);
    return result;
  } else if (fn.type === "function") {
    const funcValue = fn as FunctionVal;

    if (expr.args.length !== funcValue.params.length) {
      let caller = expr.caller as Identifier;
      throw `RunTimeError: Function "${caller.symbol}" expects ${funcValue.params.length} arguments, but ${expr.args.length} were provided.`;
    }

    // Create a new environment for the function call, inheriting the closure from the function definition
    const functionEnv = new Environment(funcValue.closure);

    // Map function parameters to their corresponding arguments
    for (let i = 0; i < funcValue.params.length; i++) {
      const paramName = funcValue.params[i];
      const argValue = evaluate(expr.args[i], env);
      functionEnv.declareVar(paramName, argValue, false);
    }

    functionEnv.declareVar("hasReturn", MAKE_BOOL(false), false);

    // Execute the function body
    let returnValue: RuntimeVal = MAKE_NUll();
    for (const statement of funcValue.body) {
      if (statement.kind === "ReturnStatement") {
        const returnStmt = statement as ReturnStatement;
        if (returnStmt.value) {
          returnValue = evaluate(returnStmt.value, functionEnv);
          return returnValue;
        } else {
          return MAKE_NUll();
        }
      } else {
        let result = evaluate(statement, functionEnv);
        let detectedReturn = functionEnv.lookupVar("hasReturn") as BooleanVal;
        if (detectedReturn.value == true) {
          returnValue = result;
          return returnValue;
        } else {
          continue;
        }
      }
    }
    return returnValue;
  } else {
    throw `RunTimeError: Cannot call non-function ${JSON.stringify(fn)}`;
  }
};

/**
 * Evaluates a return statement.
 * @param returnStmt - The return statement to evaluate.
 * @param env - The environment for variable lookup.
 * @returns The evaluated value of the return statement.
 */
export const evaluate_return_statement = (
  returnStmt: ReturnStatement,
  env: Environment,
): RuntimeVal => {
  if (returnStmt.value === undefined) {
    return MAKE_NUll();
  } else {
    let return_result = evaluate(returnStmt.value, env) as RuntimeVal;
    if (return_result.type !== "null") {
      return return_result;
    } else {
      return MAKE_NUll();
    }
  }
};
