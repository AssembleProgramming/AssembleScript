import {
  BooleanVal,
  MAKE_BOOL,
  MAKE_NATIVE_FN,
  MAKE_NUll,
  MAKE_NUM,
  MAKE_STRING,
  NumberVal,
  RuntimeVal,
  StringVal,
} from "../values.ts";
import Environment from "./environment.ts";

export function setupGlobalScope() {
  const isVaild = (actual: any, expected: any): RuntimeVal => {
    if (actual === expected) {
      console.log("✅Test passed!");
      return MAKE_BOOL(true);
    } else {
      console.log("❌Test failed!");
      console.log("⚠️ Expected: ", expected);
      console.log("⚠️ Output: ", actual);
      throw `Failed execution`;
    }
  };
  const env = new Environment();
  /** ===========================================================================================
   *                 Definition of global constant variables and builtin methods
  =========================================================================================== */
  env.declareVar("SHIELD", MAKE_BOOL(true), true);
  env.declareVar("HYDRA", MAKE_BOOL(false), true);
  env.declareVar("hasReturn", MAKE_BOOL(false), false);
  env.declareVar("null", MAKE_NUll(), true);

  // Define a native builtin method GENERAL
  env.declareVar(
    "assertEqual",
    MAKE_NATIVE_FN((args, _scope): RuntimeVal => {
      if (args.length !== 2) {
        const error_msg: any =
          `RunTimeError: No matching function for call to 'assertEqual'. Note: candidate function not viable. Function assertEqual requires 2 arguments, but ${args.length} was provided.`;
        throw error_msg;
      }
      const actual_type = args[0].type;
      const expected_type = args[1].type;

      if (actual_type !== expected_type) {
        throw `❌Test failed (Type Mismatched)`;
      } else {
        switch (actual_type) {
          case "string": {
            const actual = (args[0] as StringVal).value;
            const expected = (args[1] as StringVal).value;
            return isVaild(actual, expected);
          }
          case "number": {
            const actual = (args[0] as NumberVal).value;
            const expected = (args[1] as NumberVal).value;
            return isVaild(actual, expected);
          }
          case "boolean": {
            const actual = (args[0] as BooleanVal).value;
            const expected = (args[1] as BooleanVal).value;
            return isVaild(actual, expected);
          }

          default:
            throw `RunTimeError: Null value exception`;
        }
      }
    }),
    true,
  );
  env.declareVar(
    "vision",
    MAKE_NATIVE_FN((args, _scope): RuntimeVal => {
      if (args.length == 0) {
        console.log("\n");
        return MAKE_NUll();
      }
      for (let i = 0; i < args.length; i++) {
        const type = args[i].type;

        switch (type) {
          case "number": {
            const num_to_print = (args[i] as NumberVal).value;
            console.log(num_to_print);
            break;
          }
          case "boolean": {
            const bool_to_print = (args[i] as BooleanVal).value;
            let ans: string;
            if (bool_to_print === true) {
              ans = "true";
            } else {
              ans = "false";
            }
            console.log(ans);
            break;
          }
          case "string": {
            const string_to_print = (args[i] as StringVal).value;
            console.log(string_to_print);
            break;
          }
          case "array": {
            throw `RunTimeError: Invalid Array Print Operation. Use Iterative Method Instead.`;
          }
          case "null": {
            console.log(null);
            break;
          }
        }
      }
      return MAKE_NUll();
    }),
    true,
  );

  env.declareVar(
    "typeOf",
    MAKE_NATIVE_FN((args, _scope) => {
      const type = args[0].type;
      switch (type) {
        case "number": {
          return MAKE_STRING("number");
        }
        case "boolean": {
          return MAKE_STRING("boolean");
        }
        case "string": {
          return MAKE_STRING("string");
        }
        case "null": {
          return MAKE_STRING("null");
        }
        case "function": {
          return MAKE_STRING("function");
        }
        case "native-fn": {
          return MAKE_STRING("function");
        }
        case "array": {
          return MAKE_STRING("array");
        }
        default: {
          return MAKE_NUll();
        }
      }
    }),
    true,
  );

  /** ===========================================================================================
   *                                Number Methods
  =========================================================================================== */
  env.declareVar(
    "time",
    MAKE_NATIVE_FN((_args, _scope) => {
      return MAKE_NUM(Date.now());
    }),
    true,
  );

  env.declareVar(
    "rand",
    MAKE_NATIVE_FN((_args, _scope) => {
      return MAKE_NUM(Math.random());
    }),
    true,
  );

  env.declareVar(
    "abs",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.abs(number));
    }),
    true,
  );

  env.declareVar(
    "floor",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.floor(number));
    }),
    true,
  );

  env.declareVar(
    "ceil",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.ceil(number));
    }),
    true,
  );

  env.declareVar(
    "sin",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.sin(number));
    }),
    true,
  );

  env.declareVar(
    "cos",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.cos(number));
    }),
    true,
  );

  env.declareVar(
    "tan",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.tan(number));
    }),
    true,
  );

  env.declareVar(
    "iSin",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.asin(number));
    }),
    true,
  );
  env.declareVar(
    "iCos",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.acos(number));
    }),
    true,
  );
  env.declareVar(
    "iTan",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.atan(number));
    }),
    true,
  );

  env.declareVar(
    "round",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.round(number));
    }),
    true,
  );

  env.declareVar(
    "sqrt",
    MAKE_NATIVE_FN((args, _scope) => {
      const number = (args[0] as NumberVal).value;
      return MAKE_NUM(Math.sqrt(number));
    }),
    true,
  );
  env.declareVar(
    "min",
    MAKE_NATIVE_FN((args, _scope) => {
      const number1 = (args[0] as NumberVal).value;
      const number2 = (args[1] as NumberVal).value;
      return MAKE_NUM(Math.min(number1, number2));
    }),
    true,
  );

  env.declareVar(
    "max",
    MAKE_NATIVE_FN((args, _scope) => {
      const number1 = (args[0] as NumberVal).value;
      const number2 = (args[1] as NumberVal).value;
      return MAKE_NUM(Math.max(number1, number2));
    }),
    true,
  );

  env.declareVar(
    "pow",
    MAKE_NATIVE_FN((args, _scope) => {
      const number1 = (args[0] as NumberVal).value;
      const number2 = (args[1] as NumberVal).value;
      return MAKE_NUM(Math.pow(number1, number2));
    }),
    true,
  );

  /** ===========================================================================================
   *                                string Methods
  =========================================================================================== */
  env.declareVar(
    "len",
    MAKE_NATIVE_FN((args, _scope) => {
      const string = (args[0] as StringVal).value;
      return MAKE_NUM(string.length);
    }),
    true,
  );

  env.declareVar(
    "charAt",
    MAKE_NATIVE_FN((args, _scope) => {
      const string = (args[0] as StringVal).value;
      const idx = (args[1] as NumberVal).value;
      return MAKE_STRING(string.charAt(idx));
    }),
    true,
  );

  env.declareVar(
    "concat",
    MAKE_NATIVE_FN((args, _scope) => {
      const string1 = (args[0] as StringVal).value;
      const string2 = (args[1] as StringVal).value;
      let delimiter = " ";
      if (args.length > 2) {
        delimiter = (args[2] as StringVal).value;
      }
      return MAKE_STRING(string1.concat(delimiter, string2));
    }),
    true,
  );

  env.declareVar(
    "toLowerCase",
    MAKE_NATIVE_FN((args, _scope) => {
      const string = (args[0] as StringVal).value;
      return MAKE_STRING(string.toLowerCase());
    }),
    true,
  );

  env.declareVar(
    "toUpperCase",
    MAKE_NATIVE_FN((args, _scope) => {
      const string = (args[0] as StringVal).value;
      return MAKE_STRING(string.toUpperCase());
    }),
    true,
  );

  //Returns the index of the first occurrence of a specified value in a string.
  env.declareVar(
    "indexOf",
    MAKE_NATIVE_FN((args, _scope) => {
      const string = (args[0] as StringVal).value;
      const char = (args[1] as StringVal).value;
      let startIdx = 0;
      if (args.length > 2) {
        startIdx = (args[2] as NumberVal).value;
      }
      return MAKE_NUM(string.indexOf(char, startIdx));
    }),
    true,
  );

  //Extracts a portion of a string between two specified indices and returns a new string.
  env.declareVar(
    "subStr",
    MAKE_NATIVE_FN((args, _scope) => {
      const string = (args[0] as StringVal).value;
      const startIdx = (args[1] as NumberVal).value;
      const endIdx = (args[2] as NumberVal).value;

      return MAKE_STRING(string.substring(startIdx, endIdx));
    }),
    true,
  );

  //Removes leading and trailing whitespace from a string.
  env.declareVar(
    "trim",
    MAKE_NATIVE_FN((args, _scope) => {
      const string = (args[0] as StringVal).value;
      return MAKE_STRING(string.trim());
    }),
    true,
  );

  //Parses a string and returns an integer. The radix parameter specifies the base of the numeral system (optional, default is 10).
  env.declareVar(
    "parseInt",
    MAKE_NATIVE_FN((args, _scope) => {
      const string = (args[0] as StringVal).value;
      let radix = 10;
      if (args.length > 1) {
        radix = (args[1] as NumberVal).value;
      }
      return MAKE_NUM(parseInt(string, radix));
    }),
    true,
  );

  return env;
}
