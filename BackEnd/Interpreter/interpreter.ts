/**
 * Imports necessary types and interfaces for runtime values and AST nodes.
 */

import {
  ArrayDeclaration,
  AssignmentExpression,
  BinaryExpr,
  BooleanLiteral,
  CallExpr,
  ComparisonExpression,
  ElseStatement,
  ForLoopStatement,
  FunctionDefinition,
  Identifier,
  IfStatement,
  LogicalExpression,
  MemberExpr,
  MinusExpr,
  NumericLiteral,
  Program,
  ReturnStatement,
  Stmt,
  StringLiteral,
  SwitchStatement,
  UnaryExpr,
  VariableDeclaration,
  WhileStatement,
} from "../../FrontEnd/AST.ts";
import Environment from "../Scope/environment.ts";

import {
  BooleanVal,
  FunctionVal,
  MAKE_BOOL,
  MAKE_FUNCTION,
  MAKE_NUll,
  MAKE_STRING,
  NativeFnVal,
  NumberVal,
  RuntimeVal,
  StringVal,
} from "../values.ts";
import { evaluate_binary_expression } from "./Expressions/Binary_expression.ts";
import {
  evaluate_logical_expression,
  evaluate_unary_expr,
} from "./Expressions/Boolean_expression.ts";
import { evaluate_comparison_expression } from "./Expressions/Comparison_expression.ts";
import {
  evaluate_assignment_expression,
  evaluate_member_expression,
} from "./Expressions/Expressions.ts";
import { evaluate_minus_expression } from "./Expressions/Unary_expression.ts";
import { evaluate_break_statement } from "./Statements/Break.ts";
import {
  evaluate_else_statement,
  evaluate_if_statement,
} from "./Statements/Conditional_Jump/If_Else.ts";
import { evaluate_switch_statement } from "./Statements/Conditional_Jump/Switch_case.ts";
import {
  evaluate_array_declaration,
  evaluate_variable_declaration,
} from "./Statements/Declaration_statements.ts";
import { evaluate_for_loop_statement } from "./Statements/Loop/For_loop.ts";
import { evaluate_while_statement } from "./Statements/Loop/While_statement.ts";

/**
 * Evaluates a program by executing each statement sequentially.
 * @param program - The program to evaluate.
 * @returns The runtime value of the last evaluated statement.
 */
const evaluate_program = (program: Program, env: Environment): RuntimeVal => {
  let lastEvaluated: RuntimeVal = MAKE_NUll();

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }

  return lastEvaluated;
};

/**
 * Evaluates an identifier expression.
 * @param ident - The identifier expression.
 * @param env - The environment for variable lookup.
 * @returns The evaluated value of the identifier.
 */
const evaluate_identifier = (
  ident: Identifier,
  env: Environment,
): RuntimeVal => {
  const val = env.lookupVar(ident.symbol);
  return val;
};

/**
 * Evaluates a function definition statement.
 * @param funcDef - The function definition statement.
 * @param env - The environment for variable lookup.
 * @returns The evaluated value of the function definition.
 */
const evaluate_function_definition = (
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
/**
 * Evaluates an AST node by handling different node kinds and calling the corresponding evaluation functions.
 * @param astNode - The AST node to evaluate.
 * @returns The runtime value of the evaluated AST node.
 */
export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number",
      } as NumberVal;

    case "StringLiteral":
      return {
        value: (astNode as StringLiteral).value,
        type: "string",
      } as StringVal;

    case "BooleanLiteral":
      return {
        value: (astNode as BooleanLiteral).value,
        type: "boolean",
      } as BooleanVal;

    case "NullLiteral":
      return MAKE_NUll();

    case "Identifier":
      return evaluate_identifier(astNode as Identifier, env);

    case "CallExpr":
      return evaluate_call_expression(astNode as CallExpr, env);

    case "AssignmentExpression":
      return evaluate_assignment_expression(
        astNode as AssignmentExpression,
        env,
      );

    case "BinaryExpr":
      return evaluate_binary_expression(astNode as BinaryExpr, env);

    case "ComparisonExpression":
      return evaluate_comparison_expression(
        astNode as ComparisonExpression,
        env,
      );

    case "LogicalExpression":
      return evaluate_logical_expression(astNode as LogicalExpression, env);

    case "UnaryExpr":
      return evaluate_unary_expr(astNode as UnaryExpr, env);

    case "Program":
      return evaluate_program(astNode as Program, env);

    case "VariableDeclaration":
      return evaluate_variable_declaration(astNode as VariableDeclaration, env);

    case "ArrayDeclaration":
      return evaluate_array_declaration(astNode as ArrayDeclaration, env);

    case "IfStatement":
      return evaluate_if_statement(astNode as IfStatement, env);

    case "ElseStatement":
      return evaluate_else_statement(astNode as ElseStatement, env);

    case "WhileStatement":
      return evaluate_while_statement(astNode as WhileStatement, env);

    case "ForLoopStatement":
      return evaluate_for_loop_statement(astNode as ForLoopStatement, env);

    case "BreakStatement":
      return evaluate_break_statement();

    case "MemberExpr":
      return evaluate_member_expression(astNode as MemberExpr, env);

    case "SwitchStatement":
      return evaluate_switch_statement(astNode as SwitchStatement, env);

    case "MinusExpr":
      return evaluate_minus_expression(astNode as MinusExpr, env);

    case "FunctionDefinition":
      return evaluate_function_definition(astNode as FunctionDefinition, env);

    case "ReturnStatement":
      return evaluate_return_statement(astNode as ReturnStatement, env);
    default:
      // If the AST node has an unknown or unsupported kind, we log an error and exit the program.
      console.log(astNode);
      throw `RunTimeError: This node has not yet been setup in interpretation...`;
  }
}
