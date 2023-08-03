import {
  AssignmentExpression,
  Expr,
  Identifier,
  MemberExpr,
} from "../../../FrontEnd/AST.ts";
import Environment from "../../Scope/environment.ts";
import {
  ArrayVal,
  BooleanVal,
  MAKE_NUll,
  NumberVal,
  RuntimeVal,
  StringVal,
} from "../../values.ts";
import { evaluate } from "../interpreter.ts";

/**
 * Evaluates an assignment expression by assigning a value to a variable or array element.
 * @param node The assignment expression to evaluate.
 * @param env The environment in which the expression is evaluated.
 * @returns The result of the assignment expression.
 */
export const evaluate_assignment_expression = (
  node: AssignmentExpression,
  env: Environment,
): RuntimeVal => {
  if (node.assignee.kind === "Identifier") {
    const varname = (node.assignee as Identifier).symbol;
    const value = evaluate(node.val, env);
    return env.assignVar(varname, value);
  }
  if (node.assignee.kind === "MemberExpr") {
    const rhs = evaluate(node.val, env) as RuntimeVal;
    let rhs_value;
    if (rhs.type === "number") {
      rhs_value = (rhs as NumberVal).value;
    } else if (rhs.type === "string") {
      rhs_value = (rhs as StringVal).value;
    } else if (rhs.type === "boolean") {
      rhs_value = (rhs as BooleanVal).value;
    }

    const assigner = (node.assignee) as MemberExpr;
    const assigner_name = (assigner.object as Identifier).symbol;
    const index = evaluate(assigner.property, env) as NumberVal;
    const index_val = index.value;

    if (index.type !== "number") {
      throw new Error("Index must be a valid number");
    }
    const object = evaluate(assigner.object, env) as ArrayVal;

    if (object.type === "array") {
      const array = object.values;
      if (rhs.type === "number") {
        array[index_val] = { kind: "NumericLiteral", value: rhs_value } as Expr;
      } else if (rhs.type === "boolean") {
        array[index_val] = { kind: "BooleanLiteral", value: rhs_value } as Expr;
      } else {
        array[index_val] = { kind: "StringLiteral", value: rhs_value } as Expr;
      }
      return { type: "array", name: assigner_name, values: array } as ArrayVal;
    }
    if (object.type === "string") {
      const memberExpr = node.assignee as MemberExpr;
      const object2 = evaluate(memberExpr.object, env);
      const newValue = evaluate(node.val, env) as StringVal;
      const updatedString = {
        value: (object2 as StringVal).value.slice(0, index.value) +
          newValue.value +
          (object2 as StringVal).value.slice(index.value + 1),
        type: "string",
      } as StringVal;
      return env.assignVar(assigner_name, updatedString);
    }
    return MAKE_NUll();
  } else {
    throw `Invalid LHS inside the Assignment expression`;
  }
};

/**
 * Evaluates a member expression.
 * @param member The member expression to evaluate.
 * @param env The environment in which to evaluate the expression.
 * @returns The result of evaluating the member expression.
 * @throws {Error} If the array index is not a number or the string index is not a number.
 * @throws {Error} If the member expression is not supported for the given object type.
 */
export const evaluate_member_expression = (
  member: MemberExpr,
  env: Environment,
): RuntimeVal => {
  const object = evaluate(member.object, env);

  if (object.type === "array") {
    const index = evaluate(member.property, env) as NumberVal;
    if (index.type !== "number") {
      throw new Error("Array index must be a number");
    }
    const arrayVal = object as ArrayVal;
    const valueAtIndex = arrayVal.values[index.value];

    if (valueAtIndex && valueAtIndex.kind === "NumericLiteral") {
      return evaluate(valueAtIndex, env) as NumberVal;
    } else if (valueAtIndex && valueAtIndex.kind === "StringLiteral") {
      return evaluate(valueAtIndex, env) as StringVal;
    } else if (valueAtIndex) {
      return evaluate(valueAtIndex, env);
    }
  }

  if (object.type === "string") {
    const index = evaluate(member.property, env) as NumberVal;
    if (index.type !== "number") {
      throw new Error("String index must be a number");
    }
    return {
      type: "string",
      value: (object as StringVal).value[index.value],
    } as StringVal;
  }

  // Handle other types of objects here
  throw new Error(
    `Member expression not supported for the given object ${object.type}`,
  );
};
