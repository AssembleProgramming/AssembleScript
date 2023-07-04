/**
 * Imports necessary types and interfaces for runtime values and AST nodes.
 */

import {
  ArrayDeclaration,
  AssignmentExpression,
  BinaryExpr,
  CallExpr,
  ComparisonExpression,
  ElseStatement,
  ForLoopStatement,
  Identifier,
  IfStatement,
  LogicalExpression,
  MemberExpr,
  MinusExpr,
  NumericLiteral,
  Program,
  Stmt,
  StringLiteral,
  SwitchStatement,
  UnaryExpr,
  VariableDeclaration,
  WhileStatement,
} from "../../FrontEnd/AST.ts";
import Environment from "../Scope/environment.ts";

import { MAKE_NUll, NumberVal, RuntimeVal, StringVal } from "../values.ts";
import { evaluate_binary_expression } from "./Expressions/Binary_expression.ts";
import {
  evaluate_logical_expression,
  evaluate_unary_expr,
} from "./Expressions/Boolean_expression.ts";
import { evaluate_comparison_expression } from "./Expressions/Comparison_expression.ts";
import {
  evaluate_assignment_expression,
  evaluate_call_expression,
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
 * Evaluates an AST node by handling different node kinds and calling the corresponding evaluation functions.
 * @param astNode - The AST node to evaluate.
 * @returns The runtime value of the evaluated AST node.
 */
export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number",
      } as NumberVal;

    case "StringLiteral":
      return {
        value: (astNode as StringLiteral).value,
        type: "string",
      } as StringVal;

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

    default:
      // If the AST node has an unknown or unsupported kind, we log an error and exit the program.
      throw `This node has not yet been setup in interpretation...`;
  }
}
