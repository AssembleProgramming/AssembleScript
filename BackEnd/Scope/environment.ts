import { RuntimeVal } from "../values.ts";

/**
 * Represents an environment for variable scoping and lookup.
 */
export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  /**
   * Creates an instance of the Environment class.
   * @param parentENV - The parent environment (optional).
   */

  constructor(parentENV?: Environment) {
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

  /**
   * Declares a variable in the current environment.
   * @param varname - The name of the variable.
   * @param value - The value to assign to the variable.
   * @returns The assigned value.
   * @throws If the variable is already defined in the scope.
   */
  public declareVar(
    varname: string,
    value: RuntimeVal,
    isConst: boolean,
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw `cannot declare variable ${varname}. As it is already defined in the scope.`;
    }
    this.variables.set(varname, value);
    if (isConst) {
      this.constants.add(varname);
    }
    return value;
  }

  /**
   * Assigns a value to a variable in the current or parent environment.
   * @param varname - The name of the variable.
   * @param value - The value to assign to the variable.
   * @returns The assigned value.
   */
  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    // Find the scope in which variable exists
    const env: Environment = this.resolveScope(varname);
    if (env.constants.has(varname)) {
      throw `cannot reassign to const variable ${varname}`;
    }

    env.variables.set(varname, value);

    return value;
  }

  /**
   * Looks up the value of a variable in the current or parent environment.
   * @param varname - The name of the variable.
   * @returns The value of the variable.
   * @throws If the variable is not found in the scope.
   */
  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolveScope(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  /**
   * Resolves the scope in which a variable is defined.
   * @param varname - The name of the variable.
   * @returns The environment in which the variable is defined.
   * @throws If the variable is not found in any scope.
   */
  public resolveScope(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }
    if (this.parent === undefined) {
      throw `cannot resolve ${varname} in the scope.`;
    }
    return this.parent.resolveScope(varname);
  }

  /**
   * Clears the state of the parser by resetting the variable map and constant set.
   */
  public cleanUp(): void {
    this.variables.clear(); // Clear the variable map
    this.constants.clear(); // Clear the constant set
  }
}
