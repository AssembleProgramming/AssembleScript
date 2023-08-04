import {
  ArrayDeclaration,
  VariableDeclaration,
} from "../../../FrontEnd/AST.ts";
import Environment from "../../Scope/environment.ts";
import {
  ArrayVal,
  MAKE_NUll,
  MAKE_NUM,
  NumberVal,
  RuntimeVal,
} from "../../values.ts";
import { evaluate } from "../interpreter.ts";

/**
 * Evaluates a variable declaration.
 * @param declaration - The variable declaration to evaluate.
 * @param env - The environment in which the declaration should be evaluated.
 * @returns The runtime value of the evaluated variable declaration.
 */
export const evaluate_variable_declaration = (
  declaration: VariableDeclaration,
  env: Environment,
): RuntimeVal => {
  // Evaluate the value of the declaration if it exists, otherwise assign null value
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : MAKE_NUll();
  // Declare the variable in the environment
  return env.declareVar(declaration.identifier, value, declaration.const);
};

/**
 * Evaluates an array declaration by creating a new array value and declaring it in the environment.
 * @param declaration The array declaration to evaluate.
 * @param env The environment in which the declaration is evaluated.
 * @returns The result of the array declaration.
 */
export const evaluate_array_declaration = (
  declaration: ArrayDeclaration,
  env: Environment,
): RuntimeVal => {
  const size_expr = evaluate(declaration.size, env);
  const values_provided = declaration.values.length;

  if (size_expr.type !== "number") {
    throw `RunTimeError: The operand for subscript operator is expected to be of type number but recieved ${size_expr.type} at '${declaration.name}'`;
  }
  const arr_size = (evaluate(declaration.size, env) as NumberVal).value;
  if (arr_size > 10000000) {
    throw `RunTimeError: Segmentation Fault expected array size to be less than 1e7 at '${declaration.name}'`;
  } else if (arr_size <= 0) {
    throw `RunTimeError: Invalid Array size ${arr_size} at '${declaration.name}'`;
  }
  if (values_provided > arr_size) {
    throw `RunTimeError: Excess elements in array initializer at '${declaration.name}'. Provided array size ${arr_size} while number of elements in ${values_provided}`;
  }
  let count: number = values_provided;
  while (count < arr_size) {
    declaration.values.push({ kind: "NumericLiteral", value: 0 });
    count++;
  }

  const arr = {
    type: "array",
    name: declaration.name,
    values: declaration.values,
    size: arr_size,
  } as ArrayVal;

  return env.declareVar(declaration.name, arr, false);
};
