import { VariableDeclaration,ArrayDeclaration } from "../../../FrontEnd/AST.ts";
import Environment from "../../Scope/environment.ts";
import { RuntimeVal,MAKE_NUll,ArrayVal } from "../../values.ts";
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
    const arr = {
      type: "array",
      name: declaration.name,
      values: declaration.values,
      size: declaration.size,
    } as ArrayVal;
  
    return env.declareVar(declaration.name, arr, false);
  };