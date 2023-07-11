import { LogicalExpression, UnaryExpr } from "../../../FrontEnd/AST.ts";
import Environment from "../../Scope/environment.ts";
import { BooleanVal, MAKE_NUll, RuntimeVal } from "../../values.ts";
import { evaluate } from "../interpreter.ts";

/**
 * Evaluates a boolean logical expression by performing the corresponding arithmetic operation.
 * @param lhs - The left-hand side bool value.
 * @param rhs - The right-hand side bool value.
 * @param operator - The operator used in the expression.
 * @returns The result of the logical operation as a boolean value.
 */
export const evaluate_boolean_logical_expression = (
  lhs: BooleanVal,
  rhs: BooleanVal,
  operator: string,
): BooleanVal => {
  let result: boolean;
  if (operator === "&&" || operator === "and") {
    result = lhs.value && rhs.value;
  } else {
    result = lhs.value || rhs.value;
  }
  return { type: "boolean", value: result } as BooleanVal;
};

/**
 * Evaluates a logical expression by evaluating its left and right expressions and performing the logical operation.
 * @param logic - The logical expression to evaluate.
 * @returns The runtime value of the evaluated logical expression (true or false).
 */
export const evaluate_logical_expression = (
  logic: LogicalExpression,
  env: Environment,
): RuntimeVal => {
  const LHS = evaluate(logic.left, env);
  const RHS = evaluate(logic.right, env);

  if (LHS.type === "boolean" && RHS.type === "boolean") {
    return evaluate_boolean_logical_expression(
      LHS as BooleanVal,
      RHS as BooleanVal,
      logic.operator,
    );
  }

  // They are of different types, so return null
  return MAKE_NUll();
};

/**
 * Evaluates a unary logical expression by performing the corresponding arithmetic operation.
 * @param expr - The left-hand side bool value.
 * @returns The not of the expression value as a boolean value.
 */
export const evaluate_boolean_unary_expression = (
  expr: BooleanVal,
): BooleanVal => {
  return { type: "boolean", value: !expr.value } as BooleanVal;
};

/**
 * Evaluates a unary expression.
 * @param expr - The unary expression to evaluate.
 * @returns The result of the evaluated unary expression.
 */
export const evaluate_unary_expr = (
  expr: UnaryExpr,
  env: Environment,
): RuntimeVal => {
  const expression = evaluate(expr.argument, env);
  if (expression.type === "boolean") {
    return evaluate_boolean_unary_expression(
      expression as BooleanVal,
    );
  }

  // They are of different types, so return null
  return MAKE_NUll();
};
