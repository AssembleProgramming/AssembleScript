// deno-lint-ignore-file no-empty-interface
/**
 * Represents the type of a node in the abstract syntax tree (AST).
 * The NodeType type is a union of string literals that represent the different types of nodes in the AST.
 */
export type NodeType =
  // Statements
  | "Program"
  | "VariableDeclaration"
  | "ArrayDeclaration"
  | "IfStatement"
  | "ElseStatement"
  | "WhileStatement"
  | "ForEachLoopStatement"
  | "WakandaForStatement"
  | "BreakStatement"
  | "SwitchStatement"
  // Expressions
  | "AssignmentExpression"
  | "MemberExpr"
  | "CallExpr"
  | "AssignmentExpression"
  | "BinaryExpr"
  | "ComparisonExpression"
  | "LogicalExpression"
  | "UnaryExpr"
  | "MinusExpr"
  | "CompoundAssignmentExpr"
  // Literals
  | "Identifier"
  | "NumericLiteral"
  | "Property"
  | "StringLiteral"
  | "NullLiteral"
  | "BooleanLiteral"
  | "TemplateLiteral"
  // Function-related nodes
  | "FunctionParam"
  | "FunctionDefinition"
  | "ReturnStatement";

/**
 * Represents a statement in the program.
 * The Stmt interface represents a statement in the program. It serves as a base interface for other statement-related interfaces.
 */
export interface Stmt {
  kind: NodeType;
}

/**
 * Represents the top-level program statement.
 * The Program interface represents the top-level program statement. It has a body property that is an array of statements.
 */
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

/**
 * Represents a variable declaration statement.
 * The VariableDeclaration interface represents a statement that declares a variable. It has the following properties:
 * - kind: The type of the node ("VariableDeclaration").
 * - const: A boolean indicating if the variable is a constant.
 * - identifier: The name of the variable.
 * - value: The expression assigned to the variable (optional).
 */
export interface VariableDeclaration extends Stmt {
  kind: "VariableDeclaration";
  const: boolean;
  identifier: string;
  value?: Expr;
}

/**
 * Represents an if statement.
 * The IfStatement interface represents an if statement. It has the following properties:
 * - kind: The type of the node ("IfStatement").
 * - condition: The condition expression of the if statement.
 * - body: The body of the if statement (an array of statements).
 * - elseBranch: The else branch of the if statement (optional, can be another IfStatement or ElseStatement).
 */
export interface IfStatement extends Stmt {
  kind: "IfStatement";
  condition: Expr;
  body: Stmt[];
  elseBranch?: IfStatement | ElseStatement;
}

/**
 * Represents an else statement.
 * The ElseStatement interface represents an else statement. It has the following properties:
 * - kind: The type of the node ("ElseStatement").
 * - body: The body of the else statement (an array of statements).
 */
export interface ElseStatement extends Stmt {
  kind: "ElseStatement";
  body: Stmt[];
}

/**
 * Represents an expression in the program.
 * The Expr interface represents an expression in the program. It extends the Stmt interface.
 */
export interface Expr extends Stmt {}

/**
 * Represents an assignment expression.
 * The AssignmentExpression interface represents an assignment expression. It has the following properties:
 * - kind: The type of the node ("AssignmentExpression").
 * - assignee: The expression being assigned.
 * - val: The value being assigned.
 */
export interface AssignmentExpression extends Expr {
  kind: "AssignmentExpression";
  assignee: Expr;
  val: Expr;
}

/**
 * Represents a binary expression.
 * The BinaryExpr interface represents a binary expression. It has the following properties:
 * - kind: The type of the node ("BinaryExpr").
 * - left: The left expression of the binary operation.
 * - right: The right expression of the binary operation.
 * - operator: The binary operator used in the expression.
 */
export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}

/**
 * Represents a member expression.
 * The MemberExpr interface represents a member expression. It has the following properties:
 * - kind: The type of the node ("MemberExpr").
 * - object: The object expression that the member is accessed from.
 * - property: The property expression representing the member being accessed.
 * - computed: Indicates whether the member access is computed or not.
 */
export interface MemberExpr extends Expr {
  kind: "MemberExpr";
  object: Expr;
  property: Expr;
  computed: boolean;
}

/**
 * Represents a function call expression.
 * The CallExpr interface represents a function call expression. It has the following properties:
 * - kind: The type of the node ("CallExpr").
 * - args: An array of argument expressions passed to the function.
 * - caller: The expression that represents the function being called.
 */
export interface CallExpr extends Expr {
  kind: "CallExpr";
  args: Expr[];
  caller: Expr;
}
/**
 * Represents a comparison expression.
 * The ComparisonExpression interface represents a comparison expression. It has the following properties:
 * - kind: The type of the node ("ComparisonExpression").
 * - left: The left expression of the comparison operation.
 * - right: The right expression of the comparison operation.
 * - operator: The comparison operator used in the expression.
 */
export interface ComparisonExpression extends Expr {
  kind: "ComparisonExpression";
  left: Expr;
  right: Expr;
  operator: string;
}

/**
 * Represents a logical expression.
 * The LogicalExpression interface represents a logical expression. It has the following properties:
 * - kind: The type of the node ("LogicalExpression").
 * - left: The left expression of the logical operation.
 * - right: The right expression of the logical operation.
 * - operator: The logical operator used in the expression.
 */
export interface LogicalExpression extends Expr {
  kind: "LogicalExpression";
  left: Expr;
  right: Expr;
  operator: string;
}

/**
 * Represents a unary expression.
 * The UnaryExpr interface represents a unary expression. It has the following properties:
 * - kind: The type of the node ("UnaryExpr").
 * - argument: The argument of the unary operation.
 * - operator: The unary operator used in the expression.
 */
export interface UnaryExpr extends Expr {
  kind: "UnaryExpr";
  argument: Expr;
  operator: string;
}

/**
 * Represents an identifier expression.
 * The Identifier interface represents an identifier expression. It has the following properties:
 * - kind: The type of the node ("Identifier").
 * - symbol: The symbol representing the identifier.
 */
export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

/**
 * Represents a numeric literal expression.
 * The NumericLiteral interface represents a numeric literal expression. It has the following properties:
 * - kind: The type of the node ("NumericLiteral").
 * - value: The numeric value of the literal.
 */
export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

/**
 * Represents a null literal expression.
 * The NullLiteral interface represents a null literal expression. It has the following properties:
 * - kind: The type of the node ("NullLiteral").
 * - value: The value of the null literal ("null").
 */
export interface NullLiteral extends Expr {
  kind: "NullLiteral";
  value: "null";
}

/**
 * Represents a boolean literal expression.
 * The BooleanLiteral interface represents a bool literal expression. It has the following properties:
 * - kind: The type of the node ("BooleanLiteral").
 * - value: The value of the bool literal ("bool").
 */
export interface BooleanLiteral extends Expr {
  kind: "BooleanLiteral";
  value: boolean;
}

/**
 * Represents a property in an object or class.
 * The Property interface represents a property in an object or class. It has the following properties:
 * - kind: The type of the node ("Property").
 * - key: The key of the property, represented as a string.
 * - value: The value assigned to the property, which is an expression or undefined for methods.
 */
export interface Property extends Expr {
  kind: "Property";
  key: string;
  value?: Expr;
}

/**
 * Represents a string literal expression.
 * The StringLiteral interface represents a string literal expression. It has the following properties:
 * - kind: The type of the node ("StringLiteral").
 * - value: The string value of the literal.
 */
export interface StringLiteral extends Expr {
  kind: "StringLiteral";
  value: string;
}

/**
 * Represents an AST node for template literals.
 */
export interface TemplateLiteralNode extends Expr {
  kind: "TemplateLiteral";
  body: (string | Expr)[];
}

/**
 * Represents a while statement.
 * The WhileStatement interface represents a while statement. It has the following properties:
 * - kind: The type of the node ("WhileStatement").
 * - condition: The condition expression of the while statement.
 * - body: The body of the while statement (an array of statements).
 */
export interface WhileStatement extends Stmt {
  kind: "WhileStatement";
  condition: Expr;
  body: Stmt[];
}

/**
 * Represents a for loop statement.
 * The ForEachLoopStatement interface represents a for loop statement. It has the following properties:
 * - kind: The type of the node ("ForEachLoopStatement").
 * - iterator: The name of the loop iterator.
 * - start: The expression representing the starting value of the loop iterator.
 * - end: The expression representing the end condition of the loop.
 * - step: The expression representing the increment or decrement step of the loop iterator (optional).
 * - body: An array of statements comprising the body of the for loop.
 */
export interface ForEachLoopStatement extends Stmt {
  kind: "ForEachLoopStatement";
  iterator: string;
  start: Expr;
  end: Expr;
  step?: Expr;
  body: Stmt[];
}

/**
 * Represents a for loop statement.
 * The WakandaForStatement interface represents a for loop statement. It has the following properties:
 * - kind: The type of the node ("WakandaForStatement").
 * - iterator: The name of the loop iterator.
 * - start: The expression representing the starting value of the loop iterator.
 * - end: The expression representing the end condition of the loop.
 * - step: The expression representing the increment or decrement step of the loop iterator (optional).
 * - body: An array of statements comprising the body of the for loop.
 */
export interface WakandaForStatement extends Stmt {
  kind: "WakandaForStatement";
  initialization: Expr;
  condition: Expr;
  modification: Expr;
  body: Stmt[];
}
/**
 * Represents a break statement.
 * The BreakStatement interface represents a break statement. It has the following properties:
 * - kind: The type of the node ("BreakStatement").
 */
export interface BreakStatement extends Stmt {
  kind: "BreakStatement";
}

/**
 * Represents an array declaration statement.
 * The ArrayDeclaration interface represents an array declaration statement. It has the following properties:
 * - kind: The type of the node ("ArrayDeclaration").
 * - name: The name of the array.
 * - size: The size of the array.
 * - values: An array of expressions representing the initial values of the array.
 */
export interface ArrayDeclaration extends Stmt {
  kind: "ArrayDeclaration";
  name: string;
  size: Expr;
  values: Expr[];
}

/**
 * Represents a case within a switch statement.
 * The SwitchCase interface represents a case within a switch statement. It has the following properties:
 * - kind: The type of the node ("SwitchCase").
 * - test: The expression to test against the switch value.
 * - consequent: An array of statements to execute if the case matches.
 */
export interface SwitchCase {
  kind: "SwitchCase";
  test: Expr;
  consequent: Stmt[];
}

/**
 * Represents a switch statement.
 * The SwitchStatement interface represents a switch statement. It has the following properties:
 * - kind: The type of the node ("SwitchStatement").
 * - discriminant: The expression whose value is being tested in the switch statement.
 * - cases: An array of SwitchCase objects representing the individual cases within the switch statement.
 * - default: An array of statements to execute if no cases match.
 */
export interface SwitchStatement {
  kind: "SwitchStatement";
  discriminant: Expr;
  cases: SwitchCase[];
  default: Stmt[];
}

/**
 * Represents a minus expression.
 * The MinusExpr interface represents a minus expression. It has the following properties:
 * - kind: The type of the node ("MinusExpr").
 * - argument: The expression to be negated.
 */
export interface MinusExpr extends Expr {
  kind: "MinusExpr";
  argument: Expr;
}

/**
 * Represents a compound assignment expression.
 * The CompoundAssignmentExpr interface represents a compound assignment expression.
 * It has the following properties:
 * - kind: The type of the node ("CompoundAssignmentExpression").
 * - assignee: The expression being assigned.
 * - operator: The compound assignment operator used in the expression.
 * - val: The value being assigned.
 */
export interface CompoundAssignmentExpr extends Expr {
  kind: "CompoundAssignmentExpr";
  assignee: Expr;
  operator: string; // This can be "+=", "-=", "/=", etc.
  val: Expr;
}

/**
 * ===========================================================================================
 *                        User Defined Functions
 * ===========================================================================================
 */
/**
 * Represents a function parameter.
 * The FunctionParam interface represents a parameter of a function. It has the following properties:
 * - kind: The type of the node ("FunctionParam").
 * - name: The name of the parameter.
 */
export interface FunctionParam {
  kind: "FunctionParam";
  name: string;
}

/**
 * Represents a function definition statement.
 * The FunctionDefinition interface represents a statement that defines a function. It has the following properties:
 * - kind: The type of the node ("FunctionDefinition").
 * - name: The name of the function.
 * - params: An array of FunctionParam objects representing the function parameters.
 * - body: The body of the function (an array of statements).
 * - returnType: The return type of the function (optional).
 */
export interface FunctionDefinition extends Stmt {
  kind: "FunctionDefinition";
  name: string;
  params: FunctionParam[];
  body: Stmt[];
}

/**
 * Represents a return statement.
 * The ReturnStatement interface represents a return statement. It has the following properties:
 * - kind: The type of the node ("ReturnStatement").
 * - value: The expression being returned (optional).
 */
export interface ReturnStatement extends Stmt {
  kind: "ReturnStatement";
  value?: Expr;
}
