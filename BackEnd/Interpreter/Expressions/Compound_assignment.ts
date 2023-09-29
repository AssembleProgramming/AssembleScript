import { CompoundAssignmentExpr, Identifier } from "../../../FrontEnd/AST.ts";
import Environment from "../../Scope/environment.ts";
import { MAKE_NUll, RuntimeVal } from "../../values.ts";
import { evaluate } from "../interpreter.ts";

export const evaluate_compound_assignment_expression = (
  node: CompoundAssignmentExpr,
  env: Environment,
): RuntimeVal => {
  if (node.assignee.kind === "Identifier") {
    const varname = (node.assignee as Identifier).symbol;
    const varValue = env.lookupVar(varname);
    const operator = node.operator;

    // Evaluate the right-hand side expression once
    const rightValue = evaluate(node.val, env);

    if (varValue.type === rightValue.type) {
      switch (operator) {
        case "+=":
          if (varValue.type === "number") {
            const value = varValue.value + rightValue.value;
            console.log(value);
            return env.assignVar(varname, value);
          }
          break;
        case "-=":
          if (varValue.type === "number") {
            const value = varValue.value - rightValue.value;
            console.log(value);
            return env.assignVar(varname, value);
          }
          break;
        case "*=":
          if (varValue.type === "number") {
            const value = varValue.value * rightValue.value;
            console.log(value);
            return env.assignVar(varname, value);
          }
          break;
        case "/=":
          if (varValue.type === "number") {
            const value = varValue.value / rightValue.value;
            console.log(value);
            return env.assignVar(varname, value);
          }
          break;
        case "%=":
          if (varValue.type === "number") {
            const value = varValue.value % rightValue.value;
            console.log(value);
            return env.assignVar(varname, value);
          }
          break;
        case "^=":
          if (varValue.type === "number") {
            const value = Math.pow(varValue.value, rightValue.value);
            console.log(value);
            return env.assignVar(varname, value);
          }
          break;
        default:
          throw new Error(
            `Operator '${operator}' is not supported for type '${varValue.type}'`,
          );
      }
    } else {
      throw new Error(
        `Type Mismatch: Cannot use operator '${operator}' with different types`,
      );
    }
  }

  return MAKE_NUll();
};
