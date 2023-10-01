/**
 * Represents a parser for the given TypeScript code.
 */
import {
  ArrayDeclaration,
  AssignmentExpression,
  BinaryExpr,
  BreakStatement,
  CallExpr,
  ComparisonExpression,
  CompoundAssignmentExpr,
  ElseStatement,
  Expr,
  ForEachLoopStatement,
  FunctionDefinition,
  FunctionParam,
  Identifier,
  IfStatement,
  LogicalExpression,
  MemberExpr,
  MinusExpr,
  NullLiteral,
  NumericLiteral,
  Program,
  ReturnStatement,
  Stmt,
  StringLiteral,
  SwitchCase,
  SwitchStatement,
  TemplateLiteralInterpolation,
  TemplateLiteralNode,
  UnaryExpr,
  VariableDeclaration,
  WakandaForStatement,
  WhileStatement,
} from "./AST.ts";
import { Token, tokenize, TokenType } from "./lexer.ts";

// Order of evaluation
// 1. Primary expression
// 2. Unary expression
// 3. Multiplication
// 4. Addition
// 5. Comparison
// 6. Logical
// 7. functions
// 8. MemberExpr
// 9. AssignExpr

// The lower the rank for statement the earlier it wil get processed
// EX as Multiplication has higher precedence than Addition we will multiplication first and then addition
export default class Parser {
  private tokens: Token[] = [];

  /**
   * Checks if there are more tokens to process.
   * @returns A boolean indicating if there are more tokens.
   */
  private not_eof(): boolean {
    return this.tokens[0].type !== TokenType.EOF;
  }

  /**
   * Retrieves the current token.
   * @returns The current token.
   */
  private at(): Token {
    return this.tokens[0] as Token;
  }

  /**
   * Consumes the current token and returns it.
   * @returns The consumed token.
   */
  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  /**
   * Checks if the current token matches the expected type.
   * If not, it logs an error and exits the program.
   * @param type - The expected token type.
   * @param err - The error message to display.
   * @returns The consumed token.
   */
  private expect(type: TokenType, err: string) {
    const next = this.tokens.shift() as Token;
    if (!next || next.type !== type) {
      throw `SyntaxError:line:${next.curr_line}: Hey Avenger you just snapped an ERROR! ${err} instead scanned '${next.value}' `;
    }
    return next;
  }

  /**
   * Parses the given source code and produces an Abstract Syntax Tree (AST) program.
   * @param sourceCode - The source code to parse.
   * @returns The generated AST program.
   */
  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // Parse until End Of File
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }
    return program;
  }

  /**
   * Parses easter egg in AssembleScript
   */
  private parse_easter_egg(): Stmt {
    switch (this.at().type) {
      case TokenType.If:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'if' did you mean 'ifWorthy'`;
      case TokenType.Else:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'else' did you mean 'otherwise'`;
      case TokenType.While:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'while' did you mean 'fightUntil'`;
      case TokenType.For:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'for' did you mean 'wakandFor'`;
      case TokenType.Switch:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'switch' did you mean 'multiverse'`;
      case TokenType.Case:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'case' did you mean 'madness'`;
      case TokenType.Let:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'let' did you mean 'newAvenger'`;
      case TokenType.Const:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'const' did you mean 'newEternal'`;
      case TokenType.Return:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'return' did you mean 'snap'`;
      case TokenType.Break:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'break' did you mean 'endGame'`;
      case TokenType.True:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'true' did you mean 'SHIELD'`;
      case TokenType.False:
        throw `SyntaxError:line:${this.at().curr_line}: Hey Avenger you just snapped an error found an unexpected token 'false' did you mean 'HYDRA'`;
    }
    throw `Hey Avenger you just snapped an error {If this error displayed it's fault of developer contact them with a screenshot for reward}`;
  }

  /**
   * Parses a statement.
   * @returns The parsed statement.
   */
  private parse_stmt(): Stmt {
    // skip to parse expressions
    switch (this.at().type) {
      case TokenType.NewAvenger:
      case TokenType.NewEternal:
        return this.parse_var_declaration();
      case TokenType.Worthy:
        return this.parse_if_statement();
      case TokenType.FightUntil:
        return this.parse_while_statement();
      case TokenType.EndGame:
        return this.parse_break_statement();
      case TokenType.Team:
        return this.parse_array_declaration();
      case TokenType.Multiverse:
        return this.parse_switch_statement();
      case TokenType.WakandaForEach:
        return this.parse_for_each_loop_statement();
      case TokenType.WakandaFor:
        return this.parse_for_statement();
      case TokenType.Assemble:
        return this.parse_function_definition();
      case TokenType.Snap:
        return this.parse_return_statement();
      //?Easter egg 🥚
      case TokenType.If:
        return this.parse_easter_egg();
      case TokenType.Else:
        return this.parse_easter_egg();
      case TokenType.While:
        return this.parse_easter_egg();
      case TokenType.For:
        return this.parse_easter_egg();
      case TokenType.Switch:
        return this.parse_easter_egg();
      case TokenType.Case:
        return this.parse_easter_egg();
      case TokenType.Let:
        return this.parse_easter_egg();
      case TokenType.Const:
        return this.parse_easter_egg();
      case TokenType.Return:
        return this.parse_easter_egg();
      case TokenType.Break:
        return this.parse_easter_egg();
      case TokenType.True:
        return this.parse_easter_egg();
      case TokenType.False:
        return this.parse_easter_egg();
      default: {
        const expr = this.parse_expr();
        this.expect(TokenType.Semicolon, `Expected ';' after expression`);
        return expr;
      }
    }
  }

  /**
   * Parses a function parameter.
   *
   * @returns A FunctionParam object representing the parsed parameter.
   * @throws {Error} If there are syntax errors or missing tokens in the parameter.
   */
  private parse_function_param(): FunctionParam {
    const name = this.expect(
      TokenType.Identifier,
      "Expected parameter name",
    ).value;
    return { kind: "FunctionParam", name };
  }

  /**
   * Parses a function definition statement.
   *
   * @returns A FunctionDefinition object representing the parsed function definition.
   * @throws {Error} If there are syntax errors or missing tokens in the function definition.
   */
  private parse_function_definition(): FunctionDefinition {
    this.eat(); // Eat 'assemble' token

    const name = this.expect(
      TokenType.Identifier,
      "Expected function name",
    ).value;

    this.expect(TokenType.OpenParen, "Expected '(' after function name");

    const params: FunctionParam[] = [];
    if (this.at().type !== TokenType.CloseParen) {
      params.push(this.parse_function_param());
      while (this.at().type === TokenType.Comma && this.eat()) {
        params.push(this.parse_function_param());
      }
    }

    this.expect(TokenType.CloseParen, "Expected ')' after function parameters");

    this.expect(TokenType.OpenBrace, "Expected '{' before function body");

    const body: Stmt[] = [];
    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parse_stmt());
    }

    this.expect(TokenType.CloseBrace, "Expected '}' after function body");

    return {
      kind: "FunctionDefinition",
      name,
      params,
      body,
    } as FunctionDefinition;
  }

  /**
   * Parses a return statement.
   *
   * @returns A ReturnStatement object representing the parsed return statement.
   * @throws {Error} If there are syntax errors or missing tokens in the return statement.
   */
  private parse_return_statement(): ReturnStatement {
    this.eat(); // Eat 'snap' token

    let value: Expr | undefined = undefined;
    if (this.at().type !== TokenType.Semicolon) {
      value = this.parse_expr();
    }

    this.expect(TokenType.Semicolon, "Expected ';' after return statement");

    return {
      kind: "ReturnStatement",
      value,
    } as ReturnStatement;
  }

  /**
   * Parses a 'for' loop statement.
   *
   * @returns A parsed 'for' loop statement object.
   * @throws {Error} If the parsing encounters unexpected tokens or missing elements.
   */
  private parse_for_each_loop_statement(): Stmt {
    // Eat 'forEach' token
    this.eat();

    // Expect opening parenthesis
    this.expect(TokenType.OpenParen, "Expected '('");
    // Expect identifier as iterator in 'wakandaFor' loop
    const iterator = this.expect(
      TokenType.Identifier,
      "Expected identifier as an iterator in 'wakandaForEach' loop",
    ).value;

    // Expect 'in' keyword after iterator
    this.expect(TokenType.In, "Expected 'in' keyword after iterator");

    // Parse start expression
    const start = this.parse_expr();

    // Expect 'to' keyword after start expression
    this.expect(TokenType.To, "Expected 'to' keyword after start expression");

    // Parse end expression
    const end = this.parse_expr();

    let step: Expr | undefined = undefined;
    if (this.at().type === TokenType.Step) {
      // Step provided, parse the step expression
      this.eat();
      step = this.parse_expr();
    }

    // Expect closing parenthesis
    this.expect(TokenType.CloseParen, "Expected ')'");

    // Expect '{' before 'for' statement body
    this.expect(
      TokenType.OpenBrace,
      "Expected '{' before 'wakandaForEach' statement body",
    );

    // Parse statements within the 'for' loop body
    const body: Stmt[] = [];
    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parse_stmt());
    }

    // Expect '}' after 'for' statement body
    this.expect(
      TokenType.CloseBrace,
      "Expected '}' after 'wakandaForEach' statement body",
    );

    // Return the parsed 'for' loop statement object
    return {
      kind: "ForEachLoopStatement",
      iterator,
      start,
      end,
      step,
      body,
    } as ForEachLoopStatement;
  }

  /**
   * Parses a 'wakandaFor' loop statement.
   *
   * @returns A parsed 'wakandaFor' loop statement object.
   * @throws {Error} If the parsing encounters unexpected tokens or missing elements.
   */
  private parse_for_statement(): Stmt {
    // Eat 'wakandaFor' token
    this.eat();

    // Expect opening parenthesis
    this.expect(TokenType.OpenParen, "Expected '(' after 'wakandaFor'");

    // Parse initialization expression
    const initialization = this.parse_stmt();

    // Parse condition expression
    const condition = this.parse_expr();

    // Expect semicolon after condition
    this.expect(
      TokenType.Semicolon,
      "Expected ';' after condition in 'wakandaFor'",
    );

    // Parse increment expression
    const modification = this.parse_expr();

    // Expect closing parenthesis
    this.expect(TokenType.CloseParen, "Expected ')' after 'wakandaFor' header");

    // Expect '{' before 'wakandaFor' statement body
    this.expect(
      TokenType.OpenBrace,
      "Expected '{' before 'wakandaFor' statement body",
    );

    // Parse statements within the 'wakandaFor' loop body
    const body: Stmt[] = [];
    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parse_stmt());
    }

    // Expect '}' after 'wakandaFor' statement body
    this.expect(
      TokenType.CloseBrace,
      "Expected '}' after 'wakandaFor' statement body",
    );

    // Return the parsed 'wakandaFor' loop statement object
    return {
      kind: "WakandaForStatement",
      initialization,
      condition,
      modification,
      body,
    } as WakandaForStatement;
  }
  /**
   * Parses a 'switch' statement.
   *
   * @returns A parsed 'switch' statement object.
   * @throws {Error} If the parsing encounters unexpected tokens or missing elements.
   */
  private parse_switch_statement(): Stmt {
    // Eat 'switch' token
    this.eat();

    // Expect '(' after 'switch'
    this.expect(TokenType.OpenParen, "Expected '(' after 'multiverse' ");

    // Parse the expression used as the discriminant
    const discriminant = this.parse_expr();

    // Expect ')' after switch expression
    this.expect(
      TokenType.CloseParen,
      "Expected ')' after 'multiverse' expression",
    );

    // Expect '{' before 'switch' statement body
    this.expect(
      TokenType.OpenBrace,
      "Expected '{' before 'multiverse' statement body",
    );

    const cases: SwitchCase[] = [];
    let defaultCase: Stmt[] = [];

    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      if (this.at().type === TokenType.Madness) {
        // Parse 'case' statement
        // Eat 'case' token
        this.eat();

        // Parse the expression used as the test in 'case'
        const test = this.parse_expr();

        // Expect colon after 'case' expression
        this.expect(TokenType.Colon, "Expected ':' after 'madness' expression");

        // Parse statements within the 'case' block
        const consequent: Stmt[] = [];
        while (
          this.at().type !== TokenType.Madness &&
          this.at().type !== TokenType.Default &&
          this.at().type !== TokenType.CloseBrace &&
          this.not_eof()
        ) {
          consequent.push(this.parse_stmt());
        }
        cases.push({ test, consequent } as SwitchCase);
      } else if (this.at().type === TokenType.Default) {
        // Parse 'default' statement
        this.eat(); // Eat 'default' token

        // Expect colon after 'default'
        this.expect(TokenType.Colon, "Expected ':' after 'default'");

        // Parse statements within the 'default' block
        defaultCase = [];
        while (
          this.at().type !== TokenType.Madness &&
          this.at().type !== TokenType.Default &&
          this.at().type !== TokenType.CloseBrace &&
          this.not_eof()
        ) {
          defaultCase.push(this.parse_stmt());
        }
      } else {
        throw `SyntaxError:line:${this.at().curr_line}: Expected 'madness' or 'default' inside 'multiverse' statement`;
      }
    }

    // Expect '}' after 'switch' statement body
    this.expect(
      TokenType.CloseBrace,
      "Expected '}' after 'multiverse' statement body",
    );

    // Return the parsed 'multiverse' statement object
    return {
      kind: "SwitchStatement",
      discriminant,
      cases,
      default: defaultCase,
    } as SwitchStatement;
  }

  /**
   * Parses an array declaration statement.
   *
   * @returns A parsed array declaration statement object.
   * @throws {Error} If the parsing encounters unexpected tokens or missing elements.
   */
  private parse_array_declaration(): Stmt {
    this.eat(); // Eat 'array' token

    // Parse identifier
    const name = this.expect(
      TokenType.Identifier,
      "Expected 'team (array)' name",
    ).value;

    // Check for optional size or values
    let size: Expr;
    let vals: Expr[];

    // Check for optional size or values
    // Expect '[' after array identifier
    this.expect(
      TokenType.OpenBracket,
      `Expected '[' after identifier '${name}'`,
    );

    // Parse the array size as a number
    size = this.parse_expr();

    // Expect ')' ) after array size or values
    this.expect(TokenType.CloseBracket, "Expected ']'");

    // Expect = to add values
    this.expect(TokenType.Equals, "Expected '=' for team assignment");

    // Expect { to add array values
    this.expect(TokenType.OpenBrace, "Expected '{' to add team value");

    // Parse the array values
    vals = this.parse_array_values(size);

    // Expect } to add array values
    this.expect(TokenType.CloseBrace, "Expected '}' to add team value");

    // Expect ; at the end of the declaration statement
    this.expect(
      TokenType.Semicolon,
      "Expected ';' at end of declaration statement",
    );

    // Return the parsed array declaration statement object
    return {
      kind: "ArrayDeclaration",
      name,
      size,
      values: vals,
    } as ArrayDeclaration;
  }

  /**
   * Parses the array values for an array declaration statement.
   *
   * @param size - The expected size of the array.
   * @returns An array of parsed expressions representing the array values.
   * @throws {Error} If the array size is exceeded by the number of values provided.
   */
  private parse_array_values(size: Expr): Expr[] {
    const values: Expr[] = [];

    // Continue parsing values until encountering the '}' or reaching the end of input
    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      values.push(this.parse_expr());
      if (this.at().type === TokenType.Comma) {
        this.eat(); // Eat the comma if present
      }
    }

    return values;
  }

  /**
   * Parses an if statement or an else statement.
   *
   * @returns An IfStatement or ElseStatement object representing the parsed statement.
   * @throws {Error} If there are syntax errors or missing tokens in the statement.
   */
  private parse_if_statement(): IfStatement | ElseStatement {
    this.eat(); // Eat 'if' token
    this.expect(TokenType.OpenParen, "Expected '(' after 'ifWorthy'");
    const condition = this.parse_expr();
    this.expect(
      TokenType.CloseParen,
      "Expected ')' after condition in 'ifWorthy' statement",
    );

    this.expect(
      TokenType.OpenBrace,
      "Expected '{' before 'ifWorthy' statement body",
    );
    const body: Stmt[] = [];
    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parse_stmt());
    }
    this.expect(
      TokenType.CloseBrace,
      "Expected '}' after 'ifWorthy' statement body",
    );
    let elseBranch: IfStatement | ElseStatement | undefined = undefined;
    if (this.at().type === TokenType.Otherwise) {
      this.eat(); // Eat 'else' token
      if (this.at().type === TokenType.Worthy) {
        // 'else if' statement
        elseBranch = this.parse_if_statement();
      } else {
        // 'else' statement
        this.expect(
          TokenType.OpenBrace,
          "Expected '{' before 'otherwise' statement body",
        );
        const elseBody: Stmt[] = [];
        while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
          elseBody.push(this.parse_stmt());
        }
        this.expect(
          TokenType.CloseBrace,
          "Expected '}' after 'otherwise' statement body",
        );

        elseBranch = { kind: "ElseStatement", body: elseBody };
      }
    }

    return { kind: "IfStatement", condition, body, elseBranch } as IfStatement;
  }

  /**
   * Parses a while statement.
   *
   * @returns A WhileStatement object representing the parsed statement.
   * @throws {Error} If there are syntax errors or missing tokens in the statement.
   */
  private parse_while_statement(): Stmt {
    this.eat(); // Eat 'while' token
    this.expect(TokenType.OpenParen, "Expected '(' after 'fightUntil'");

    const condition = this.parse_expr();

    this.expect(
      TokenType.CloseParen,
      "Expected ')' after condition in 'fightUntil' statement",
    );

    this.expect(
      TokenType.OpenBrace,
      "Expected '{' before 'fightUntil' statement body",
    );

    const body: Stmt[] = [];

    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parse_stmt());
    }

    this.expect(
      TokenType.CloseBrace,
      "Expected '}' after 'fightUntil' statement body",
    );

    return {
      kind: "WhileStatement",
      condition,
      body,
    } as WhileStatement;
  }

  /**
   * Parses a variable declaration statement.
   *
   * @returns A VariableDeclaration object representing the parsed statement.
   * @throws {Error} If there are syntax errors or missing tokens in the statement.
   */
  private parse_var_declaration(): Stmt {
    const isConstant = this.eat().type === TokenType.NewEternal;
    const identifier = this.expect(
      TokenType.Identifier,
      "Expected identifier name while declaration",
    ).value;

    if (this.at().type === TokenType.Semicolon) {
      // Consume semicolon
      this.eat();
      if (isConstant) {
        throw `SyntaxError:line:${this.at().curr_line}: Must assign value to constant expression ${identifier}`;
      }
      return {
        kind: "VariableDeclaration",
        identifier,
        const: false,
        value: undefined,
      } as VariableDeclaration;
    }

    this.expect(
      TokenType.Equals,
      `Expected assignment to identifier ${identifier}`,
    );

    const declaration = {
      kind: "VariableDeclaration",
      value: this.parse_expr(),
      const: isConstant,
      identifier,
    } as VariableDeclaration;

    // Check semicolon
    this.expect(TokenType.Semicolon, "Expected ';'");
    return declaration;
  }

  /**
   * Parses an expression.
   * @returns The parsed expression.
   */
  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  /**
   * Parses an assignment expression.
   * @returns The parsed assignment expression as an Expr object.
   */
  private parse_break_statement(): Expr {
    this.eat(); // Eat 'break' token
    this.expect(TokenType.Semicolon, "Expected ';'");
    return { kind: "BreakStatement" } as BreakStatement;
  }

  /**
   * Parses an assignment expression.
   *
   * @returns An AssignmentExpression object representing the parsed expression.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_assignment_expr(): Expr {
    const left = this.parse_logical_expr();
    if (this.at().type === TokenType.Equals) {
      // Consume the equals token we just found
      this.eat();

      const value = this.parse_assignment_expr();
      return {
        val: value,
        assignee: left,
        kind: "AssignmentExpression",
      } as AssignmentExpression;
    } else if (this.at().type === TokenType.CompoundAssignmentOperator) {
      const operator = this.at().value;
      this.eat();
      const value = this.parse_assignment_expr();
      return {
        assignee: left,
        val: value,
        kind: "CompoundAssignmentExpr",
        operator: operator,
      } as CompoundAssignmentExpr;
    }
    return left;
  }

  /**
   * Parses a unary expression.
   * @returns The parsed unary expression.
   */
  private parse_not_expr(): Expr {
    const operator = this.eat().value;
    const argument = this.parse_comparison_expr();
    return { kind: "UnaryExpr", operator, argument } as UnaryExpr;
  }

  /**
   * Parses a logical expression.
   * @returns The parsed logical expression.
   */
  private parse_logical_expr(): Expr {
    let left = this.parse_comparison_expr();

    while (this.at().type === TokenType.LogicalOperator) {
      const operator = this.eat().value;
      const right = this.parse_comparison_expr();

      left = {
        kind: "LogicalExpression",
        left,
        right,
        operator,
      } as LogicalExpression;
    }

    return left;
  }

  /**
   * Parses a comparison expression.
   * @returns The parsed comparison expression.
   */
  private parse_comparison_expr(): Expr {
    let left = this.parse_additive_expr();

    while (this.at().type === TokenType.ComparisonOperator) {
      const operator = this.eat().value; // Consume the comparison operator token
      const right = this.parse_additive_expr(); // Parse the right-hand side of the comparison

      left = {
        kind: "ComparisonExpression",
        left,
        right,
        operator,
      } as ComparisonExpression; // Create a ComparisonExpression node

      // Continue parsing if there are more comparison operators
    }

    return left;
  }

  /**
   * Parses an additive expression.
   * @returns The parsed additive expression.
   */
  // Addition is left assoc do parse LHS first
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();

    // Pase operator
    while (this.at().value === "+" || this.at().value === "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expr();

      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }

  /**
   * Parses a multiplicative expression.
   * @returns The parsed multiplicative expression.
   */
  private parse_multiplicative_expr(): Expr {
    let left = this.parse_exponential_expr();

    // Pase operator
    while (
      this.at().value === "*" ||
      this.at().value === "/" ||
      this.at().value === "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_exponential_expr();

      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }

  /**
   * Parses a multiplicative expression.
   * @returns The parsed multiplicative expression.
   */
  private parse_exponential_expr(): Expr {
    let left = this.parse_call_member_expr();

    // Pase operator
    while (this.at().value === "^") {
      const operator = this.eat().value;
      const right = this.parse_call_member_expr();

      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }

  /**
   * Parses a call member expression.
   *
   * @returns An Expr object representing the parsed expression.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_call_member_expr(): Expr {
    const member = this.parse_member_expr();

    if (this.at().type === TokenType.OpenParen) {
      return this.parse_call_expr(member);
    }
    return member;
  }

  /**
   * Parses a call expression.
   *
   * @param caller - The expression representing the caller.
   * @returns An Expr object representing the parsed call expression.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_call_expr(caller: Expr): Expr {
    let call_expr: Expr = {
      kind: "CallExpr",
      caller: caller,
      args: this.parse_args(),
    } as CallExpr;

    if (this.at().type === TokenType.OpenParen) {
      call_expr = this.parse_call_expr(call_expr);
    }

    return call_expr;
  }

  /**
   * Parses the arguments in a function call.
   *
   * @returns An array of Expr objects representing the parsed arguments.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_args(): Expr[] {
    this.expect(TokenType.OpenParen, `Expected '('`);
    const args = this.at().type === TokenType.CloseParen
      ? []
      : this.parse_arguments_list();

    this.expect(TokenType.CloseParen, `Expected ')'`);
    return args;
  }

  /**
   * Parses the list of arguments in a function call.
   *
   * @returns An array of Expr objects representing the parsed arguments.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_arguments_list(): Expr[] {
    const args = [this.parse_assignment_expr()];

    while (this.at().type === TokenType.Comma && this.eat()) {
      args.push(this.parse_assignment_expr());
    }

    return args;
  }

  /**
   * Parses a member expression.
   *
   * @returns An Expr object representing the parsed member expression.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_member_expr(): Expr {
    let object = this.parse_unary_expr();

    while (this.at().type === TokenType.OpenBracket) {
      this.eat(); // Consume the opening bracket
      const property = this.parse_expr();
      this.expect(TokenType.CloseBracket, "Expected ']'");

      object = {
        kind: "MemberExpr",
        object,
        property,
        computed: true,
      } as MemberExpr;
    }

    return object;
  }

  /**
   * Parses a unary expression.
   *
   * @returns An Expr object representing the parsed unary expression.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_unary_expr(): Expr {
    switch (this.at().type) {
      case TokenType.Minus:
        return this.parse_minus_expression();
      default:
        return this.parse_primary_expr();
    }
  }

  /**
   * Parses a minus expression.
   *
   * @returns An Expr object representing the parsed minus expression.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_minus_expression(): Expr {
    this.eat(); // Eat '<MINUS>' token
    const Expression = this.parse_primary_expr();
    return {
      kind: "MinusExpr",
      argument: Expression,
    } as MinusExpr;
  }

  /**
   * Parses a template literal.
   *
   * @returns An Expr object representing the parsed template literal.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_template_literal(): Expr {
    const parts: (string | TemplateLiteralInterpolation)[] = [];
    this.expect(
      TokenType.BackTicks,
      "Expected template literal to start with a backtick (`)",
    );

    while (this.at().type !== TokenType.BackTicks) {
      if (this.at().type === TokenType.Interpolation) {
        this.eat();
        this.expect(
          TokenType.OpenBrace,
          "Expected template literal to start with a backtick '{'",
        );
        const interpolation = this.parse_expr();
        parts.push({
          kind: "TemplateLiteralInterpolation",
          value: interpolation,
        });
        this.expect(
          TokenType.CloseBrace,
          "Expected '}'",
        );
      } else if (this.at().type === TokenType.String) {
        parts.push(this.at().value);
        this.eat();
      } else {
        // Handle other tokens inside template literals
        throw `SyntaxError:line:${this.at().curr_line}: Unexpected token found inside template literal`;
      }
    }
    // Add the last string part
    console.log(parts);

    this.expect(
      TokenType.BackTicks,
      "Expected template literal to end with a backtick (`)",
    );

    return { kind: "TemplateLiteral", body: parts } as TemplateLiteralNode;
  }
  /**
   * Parses a primary expression.
   *
   * @returns An Expr object representing the parsed primary expression.
   * @throws {Error} If there are syntax errors or missing tokens in the expression.
   */
  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    switch (tk) {
      // User defined identifiers
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;

      // Constant numbers
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      // String Value
      case TokenType.String:
        return {
          kind: "StringLiteral",
          value: this.eat().value,
        } as StringLiteral;

      // Null value
      case TokenType.Null:
        this.eat();
        return { kind: "NullLiteral", value: "null" } as NullLiteral;

      case TokenType.OpenParen: {
        this.eat(); //Eat '('
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesized expression. Expected ')'",
        ); //Eat ')'
        return value;
      }
      case TokenType.OpenBrace: {
        this.eat(); //Eat '('
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseBrace,
          "Unexpected token found inside parenthesized expression. Expected ')'",
        ); //Eat ')'
        return value;
      }

      // Unary expression
      case TokenType.NotOperator:
        return this.parse_not_expr();

        // Handle template literals
      case TokenType.BackTicks:
        return this.parse_template_literal();

      default:
        throw `SyntaxError:line:${this.at().curr_line}: Unexpected token found while parsing scanned ${this.at().value}`;
    }
  }
}
