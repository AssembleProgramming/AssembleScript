import { Expr } from "../FrontEnd/AST.ts";
import Environment from "./Scope/environment.ts";

/**
 * Represents the possible value types for a RuntimeVal.
 */
export type ValueType =
  | "null"
  | "number"
  | "boolean"
  | "native-fn"
  | "string"
  | "function"
  | "break"
  | "continue"
  | "array";

/**
 * Represents a runtime value.
 */
export interface RuntimeVal {
  type: ValueType;
}

/**
 * Represents a null value.
 */
export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

/**
 * Creates a null value.
 * @returns The created NullVal object.
 */
export function MAKE_NUll(): NullVal {
  return { type: "null", value: null } as NullVal;
}

/**
 * Represents a boolean value.
 */
export interface BooleanVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}
/**
 * Creates a boolean value.
 * @param flag - The boolean value.
 * @returns The created BooleanVal object.
 */
export function MAKE_BOOL(flag: boolean): BooleanVal {
  return { type: "boolean", value: flag } as BooleanVal;
}

/**
 * Represents a number value.
 */
export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}
/**
 * Creates a number value.
 * @param num - The number value.
 * @returns The created NumberVal object.
 */
export function MAKE_NUM(num = 0): NumberVal {
  return { type: "number", value: num } as NumberVal;
}

/**
 * Represents a Native Function.
 */
export interface NativeFnVal extends RuntimeVal {
  type: "native-fn";
  call: FunctionCall;
}
export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

export function MAKE_NATIVE_FN(call: FunctionCall) {
  return { type: "native-fn", call } as NativeFnVal;
}

/**
 * Represents a String.
 */
export interface StringVal extends RuntimeVal {
  type: "string";
  value: string;
}

/**
 * Creates a string value.
 * @param str - The string value.
 * @returns The created StringVal object.
 */
export function MAKE_STRING(str: string): StringVal {
  return { type: "string", value: str } as StringVal;
}

export interface BreakVal extends RuntimeVal {
  type: "break";
}

export interface ArrayVal extends RuntimeVal {
  type: "array";
  name: string;
  values: Expr[]; // Array values
  size: number;
}
