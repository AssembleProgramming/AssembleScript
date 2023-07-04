import { BinaryExpr } from "../../../FrontEnd/AST.ts";
import Environment from "../../Scope/environment.ts";
import { NumberVal,StringVal,RuntimeVal,MAKE_NUll } from "../../values.ts";
import { evaluate } from "../interpreter.ts";


/**
 * Evaluates a numeric binary expression by performing the corresponding arithmetic operation.
 * @param lhs - The left-hand side number value.
 * @param rhs - The right-hand side number value.
 * @param operator - The operator used in the expression.
 * @returns The result of the arithmetic operation as a number value.
 */
export const evaluate_numeric_binary_expression = (
    lhs: NumberVal,
    rhs: NumberVal,
    operator: string,
  ): NumberVal => {
    let result: number;
    if (operator == "+") {
      result = lhs.value + rhs.value;
    } else if (operator == "-") {
      result = lhs.value - rhs.value;
    } else if (operator == "*") {
      result = lhs.value * rhs.value;
    } else if (operator == "/") {
      // TODO: Division by zero check
      result = lhs.value / rhs.value;
    } else if (operator == "^") {
      result = Math.pow(lhs.value, rhs.value);
    } else {
      result = lhs.value % rhs.value;
    }
    return { type: "number", value: result } as NumberVal;
  };
  
  /**
   * Evaluates a binary expression between a numeric value and a string value.
   * @param lhs The left-hand side numeric value.
   * @param rhs The right-hand side string value.
   * @param operator The operator used in the binary expression.
   * @returns The result of the binary expression as a string value.
   */
 export const evaluate_numeric_string_binary_expression = (
    lhs: NumberVal,
    rhs: StringVal,
    operator: string,
  ): StringVal => {
    let result: string;
    if (operator == "+") {
      result = lhs.value + rhs.value;
    } else if (operator == "-") {
      result = "NaN";
    } else if (operator == "*") {
      result = rhs.value;
      while (--lhs.value) {
        result += rhs.value;
      }
    } else if (operator == "/") {
      result = "NaN";
    } else {
      result = "NaN";
    }
    return { type: "string", value: result } as StringVal;
  };
  
  /**
   * Evaluates a binary expression between a string value and a numeric value.
   * @param lhs The left-hand side string value.
   * @param rhs The right-hand side numeric value.
   * @param operator The operator used in the binary expression.
   * @returns The result of the binary expression as a string value.
   */
  export const evaluate_string_numeric_binary_expression = (
    lhs: StringVal,
    rhs: NumberVal,
    operator: string,
  ): StringVal => {
    let result: string;
    if (operator == "+") {
      result = lhs.value + rhs.value;
    } else if (operator == "-") {
      result = "NaN";
    } else if (operator == "*") {
      result = lhs.value;
      while (--rhs.value) {
        result += lhs.value;
      }
    } else if (operator == "/") {
      result = "NaN";
    } else {
      result = "NaN";
    }
    return { type: "string", value: result } as StringVal;
  };
  
  /**
   * Evaluates a binary expression between two string values.
   * @param lhs The left-hand side string value.
   * @param rhs The right-hand side string value.
   * @param operator The operator used in the binary expression.
   * @returns The result of the binary expression as a string value.
   */
  export const evaluate_string_binary_expression = (
    lhs: StringVal,
    rhs: StringVal,
    operator: string,
  ): StringVal => {
    let result: string;
    if (operator == "+") {
      result = lhs.value + rhs.value;
    } else if (operator == "-") {
      result = "NaN";
    } else if (operator == "*") {
      result = "NaN";
    } else if (operator == "/") {
      result = "NaN";
    } else {
      result = "NaN";
    }
    return { type: "string", value: result } as StringVal;
  };
  
  /**
   * Evaluates a binary expression by evaluating its left and right expressions and performing the corresponding operation.
   * @param binop - The binary expression to evaluate.
   * @returns The runtime value of the evaluated binary expression.
   */
  export const evaluate_binary_expression = (
    binop: BinaryExpr,
    env: Environment,
  ): RuntimeVal => {
    const LHS = evaluate(binop.left, env);
    const RHS = evaluate(binop.right, env);
  
    if (LHS.type == "number" && RHS.type == "number") {
      return evaluate_numeric_binary_expression(
        LHS as NumberVal,
        RHS as NumberVal,
        binop.operator,
      );
    } else if (LHS.type == "number" && RHS.type == "string") {
      return evaluate_numeric_string_binary_expression(
        LHS as NumberVal,
        RHS as StringVal,
        binop.operator,
      );
    } else if (LHS.type == "string" && RHS.type == "number") {
      return evaluate_string_numeric_binary_expression(
        LHS as StringVal,
        RHS as NumberVal,
        binop.operator,
      );
    } else if (LHS.type == "string" && RHS.type == "string") {
      return evaluate_string_binary_expression(
        LHS as StringVal,
        RHS as StringVal,
        binop.operator,
      );
    }
  
    // else they are of different type
    return MAKE_NUll();
  };