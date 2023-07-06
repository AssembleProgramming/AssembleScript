import { ComparisonExpression } from "../../../FrontEnd/AST.ts";
import Environment from "../../Scope/environment.ts";
import {
  BooleanVal,
  MAKE_NUll,
  NumberVal,
  RuntimeVal,
  StringVal,
} from "../../values.ts";
import { evaluate } from "../interpreter.ts";

/**
 * Evaluates a numeric comparison expression by performing the corresponding arithmetic operation.
 * @param lhs - The left-hand side number value.
 * @param rhs - The right-hand side number value.
 * @param operator - The operator used in the expression.
 * @returns The result of the comparison operation as a boolean value.
 */
export const evaluate_numeric_comparison_expression = (
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string,
): BooleanVal => {
  let result: boolean;
  if (operator == "==") {
    result = lhs.value === rhs.value;
  } else if (operator == "!=") {
    result = lhs.value !== rhs.value;
  } else if (operator == "<") {
    result = lhs.value < rhs.value;
  } else if (operator == ">") {
    result = lhs.value > rhs.value;
  } else if (operator == "<=") {
    result = lhs.value <= rhs.value;
  } else {
    result = lhs.value >= rhs.value;
  }
  return { type: "boolean", value: result } as BooleanVal;
};

/**
 * Evaluates a comparison expression between two string values.
 * @param lhs The left-hand side string value.
 * @param rhs The right-hand side string value.
 * @param operator The operator used in the comparison expression.
 * @returns The result of the comparison as a boolean value.
 */
export const evaluate_string_comparison_expression = (
  lhs: StringVal,
  rhs: StringVal,
  operator: string,
): BooleanVal => {
  let result: boolean;
  if (operator == "==") {
    result = lhs.value === rhs.value;
  } else if (operator == "!=") {
    result = lhs.value !== rhs.value;
  } else if (operator == "<") {
    result = lhs.value < rhs.value;
  } else if (operator == ">") {
    result = lhs.value > rhs.value;
  } else if (operator == "<=") {
    result = lhs.value <= rhs.value;
  } else {
    result = lhs.value >= rhs.value;
  }
  return { type: "boolean", value: result } as BooleanVal;
};

/**
 * Evaluates a comparison expression by evaluating its left and right expressions and performing the comparison operation.
 * @param comp - The comparison expression to evaluate.
 * @returns The runtime value of the evaluated comparison expression (true or false).
 */
export const evaluate_comparison_expression = (
  comp: ComparisonExpression,
  env: Environment,
): RuntimeVal => {
  const LHS = evaluate(comp.left, env);
  const RHS = evaluate(comp.right, env);

  if (LHS.type == "number" && RHS.type == "number") {
    return evaluate_numeric_comparison_expression(
      LHS as NumberVal,
      RHS as NumberVal,
      comp.operator,
    );
  }

  if (LHS.type == "string" && RHS.type == "string") {
    return evaluate_string_comparison_expression(
      LHS as StringVal,
      RHS as StringVal,
      comp.operator,
    );
  }

  // They are of different types, so return null
  return MAKE_NUll();
};
