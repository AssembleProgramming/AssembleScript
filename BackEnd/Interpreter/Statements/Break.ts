import { BreakVal, RuntimeVal } from "../../values.ts";

/**
 * Evaluates a continue statement.
 * @returns An object with a property `type` set to "continue" to indicate a continue statement.
 */
export const evaluate_break_statement = (): RuntimeVal => {
  return { type: "break" } as BreakVal;
};
