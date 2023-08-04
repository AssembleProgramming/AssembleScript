import { MinusExpr } from "../../../FrontEnd/AST.ts";
import Environment from "../../Scope/environment.ts";
import { NumberVal, RuntimeVal } from "../../values.ts";
import { evaluate } from "../interpreter.ts";

/**
 * Evaluates the negation of a number value.
 * @param rhs The number value to negate.
 * @returns The negated number value.
 */
export const evaluate_minus = (rhs: NumberVal): NumberVal => {
  const res = -1 * rhs.value;
  return { type: "number", value: res } as NumberVal;
};

/**
 * Evaluates a minus expression.
 * @param expr The minus expression to evaluate.
 * @param env The environment in which to evaluate the expression.
 * @returns The result of evaluating the minus expression.
 * @throws {Error} If the RHS of the minus operator is not of type number.
 */
export const evaluate_minus_expression = (
  expr: MinusExpr,
  env: Environment,
): RuntimeVal => {
  const expression = evaluate(expr.argument, env);
  if (expression.type === "number") {
    return evaluate_minus(expression as NumberVal);
  }
  throw `RunTimeError: The RHS to <MINUS> operator should be of type number`;
};
