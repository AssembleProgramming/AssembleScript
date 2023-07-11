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
  ElseStatement,
  Expr,
  ForLoopStatement,
  Identifier,
  IfStatement,
  LogicalExpression,
  MemberExpr,
  MinusExpr,
  NullLiteral,
  NumericLiteral,
  Program,
  Stmt,
  StringLiteral,
  SwitchCase,
  SwitchStatement,
  UnaryExpr,
  VariableDeclaration,
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
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type !== type) {
      console.error("Parser Error: \n", err, prev, "- Expecting: ", type);
      Deno.exit(1);
    }
    return prev;
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
      case TokenType.WakandaFor:
        return this.parse_for_loop_statement();
      default: {
        const expr = this.parse_expr();
        this.expect(
          TokenType.Semicolon,
          "Expected semicolon at the end of the statement",
        );
        return expr;
      }
    }
  }

  /**
   * Parses a 'for' loop statement.
   *
   * @returns A parsed 'for' loop statement object.
   * @throws {Error} If the parsing encounters unexpected tokens or missing elements.
   */
  private parse_for_loop_statement(): Stmt {
    // Eat 'for' token
    this.eat();

    // Expect identifier as iterator in 'for' statement
    const iterator = this.expect(
      TokenType.Identifier,
      "Expected identifier as iterator in 'for' statement",
    ).value;

    // Expect 'in' keyword after iterator
    this.expect(TokenType.In, "Expected `in` keyword after iterator");

    // Parse start expression
    const start = this.parse_expr();

    // Expect 'to' keyword after start expression
    this.expect(TokenType.To, "Expected `to` keyword after start expression");

    // Parse end expression
    const end = this.parse_expr();

    let step: Expr | undefined = undefined;
    if (this.at().type === TokenType.Step) {
      // Step provided, parse the step expression
      this.eat();
      step = this.parse_expr();
    }

    // Expect opening brace before 'for' statement body
    this.expect(
      TokenType.OpenBrace,
      "Expected opening brace before 'for' statement body",
    );

    // Parse statements within the 'for' loop body
    const body: Stmt[] = [];
    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parse_stmt());
    }

    // Expect closing brace after 'for' statement body
    this.expect(
      TokenType.CloseBrace,
      "Expected closing brace after 'for' statement body",
    );

    // Return the parsed 'for' loop statement object
    return {
      kind: "ForLoopStatement",
      iterator,
      start,
      end,
      step,
      body,
    } as ForLoopStatement;
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

    // Expect opening parenthesis after 'switch'
    this.expect(
      TokenType.OpenParen,
      "Expected opening parenthesis after 'switch'",
    );

    // Parse the expression used as the discriminant
    const discriminant = this.parse_expr();

    // Expect closing parenthesis after switch expression
    this.expect(
      TokenType.CloseParen,
      "Expected closing parenthesis after switch expression",
    );

    // Expect opening brace before 'switch' statement body
    this.expect(
      TokenType.OpenBrace,
      "Expected opening brace before 'switch' statement body",
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
        this.expect(TokenType.Colon, "Expected colon after 'case' expression");

        // Parse statements within the 'case' block
        const consequent: Stmt[] = [];
        while (
          this.at().type !== TokenType.Madness &&
          this.at().type !== TokenType.Default &&
          this.at().type !== TokenType.CloseBrace && this.not_eof()
        ) {
          consequent.push(this.parse_stmt());
        }
        cases.push({ test, consequent } as SwitchCase);
      } else if (this.at().type === TokenType.Default) {
        // Parse 'default' statement
        this.eat(); // Eat 'default' token

        // Expect colon after 'default'
        this.expect(TokenType.Colon, "Expected colon after 'default'");

        // Parse statements within the 'default' block
        defaultCase = [];
        while (
          this.at().type !== TokenType.Madness &&
          this.at().type !== TokenType.Default &&
          this.at().type !== TokenType.CloseBrace && this.not_eof()
        ) {
          defaultCase.push(this.parse_stmt());
        }
      } else {
        throw "Expected 'case' or 'default' inside 'switch' statement";
      }
    }

    // Expect closing brace after 'switch' statement body
    this.expect(
      TokenType.CloseBrace,
      "Expected closing brace after 'switch' statement body",
    );

    // Return the parsed 'switch' statement object
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
    const name = this.expect(TokenType.Identifier, "Expected array name").value;

    // Check for optional size or values
    let size = 0;
    let vals: Expr[];

    // Check for optional size or values
    if (this.at().type === TokenType.OpenParen) {
      // Expect opening parenthesis ( after array identifier
      this.expect(
        TokenType.OpenParen,
        "Expected opening parenthesis ( after array identifier",
      );

      // Parse the array size as a number
      size = parseInt(
        this.expect(TokenType.Number, "Expected array size").value,
      );

      // Expect closing parenthesis ) after array size or values
      this.expect(
        TokenType.CloseParen,
        "Expected closing parenthesis ) after array size or values",
      );
    }

    // Expect = to add values
    this.expect(TokenType.Equals, "Expected = to add values");

    // Expect { to add array values
    this.expect(TokenType.OpenBrace, "Expected { to add array value");

    // Parse the array values
    vals = this.parse_array_values(size);

    // Expect } to add array values
    this.expect(TokenType.CloseBrace, "Expected } to add array value");

    // Expect ; at the end of the declaration statement
    this.expect(
      TokenType.Semicolon,
      "Expected ; at end of declaration statement",
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
  private parse_array_values(size: number): Expr[] {
    const values: Expr[] = [];
    let cnt = 1;

    // Continue parsing values until encountering the closing brace or reaching the end of input
    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      if (cnt <= size) {
        // If there are still available slots in the array, parse the expression and add it to the values
        values.push(this.parse_expr());
      } else {
        // If the array size is exceeded, throw an error indicating the expected size
        throw `Array size exceeded by the number of values provided. Expected ${size} values.`;
      }
      if (this.at().type === TokenType.Comma) {
        this.eat(); // Eat the comma if present
      }
      cnt++;
    }

    // If there are remaining empty slots in the array, fill them with a default NumericLiteral of value 0
    while (cnt <= size) {
      values.push({ kind: "NumericLiteral", value: 0 } as NumericLiteral);
      cnt++;
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
    this.expect(TokenType.OpenParen, "Expected opening parenthesis after 'if'");
    const condition = this.parse_expr();
    this.expect(
      TokenType.CloseParen,
      "Expected closing parenthesis after condition in 'if' statement",
    );

    this.expect(
      TokenType.OpenBrace,
      "Expected opening brace before 'if' statement body",
    );
    const body: Stmt[] = [];
    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parse_stmt());
    }
    this.expect(
      TokenType.CloseBrace,
      "Expected closing brace after 'if' statement body",
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
          "Expected opening brace before 'else' statement body",
        );
        const elseBody: Stmt[] = [];
        while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
          elseBody.push(this.parse_stmt());
        }
        this.expect(
          TokenType.CloseBrace,
          "Expected closing brace after 'else' statement body",
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
    this.expect(
      TokenType.OpenParen,
      "Expected opening parenthesis after 'while'",
    );

    const condition = this.parse_expr();

    this.expect(
      TokenType.CloseParen,
      "Expected closing parenthesis after condition in 'while' statement",
    );

    this.expect(
      TokenType.OpenBrace,
      "Expected opening brace before 'while' statement body",
    );

    const body: Stmt[] = [];

    while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parse_stmt());
    }

    this.expect(
      TokenType.CloseBrace,
      "Expected closing brace after 'while' statement body",
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
        throw `Must assign value to constant expression.`;
      }
      return {
        kind: "VariableDeclaration",
        identifier,
        const: false,
        value: undefined,
      } as VariableDeclaration;
    }

    this.expect(TokenType.Equals, "Expected assignment to identifier");

    const declaration = {
      kind: "VariableDeclaration",
      value: this.parse_expr(),
      const: isConstant,
      identifier,
    } as VariableDeclaration;

    // Check semicolon
    this.expect(TokenType.Semicolon, "Expected Semicolon");
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
    this.expect(TokenType.Semicolon, "Expected Semicolon");
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

    while (
      this.at().type === TokenType.ComparisonOperator
    ) {
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
      this.at().value === "*" || this.at().value === "/" ||
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
    while (
      this.at().value === "^"
    ) {
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
    this.expect(TokenType.OpenParen, `Expected open parenthesis`);
    const args = this.at().type === TokenType.CloseParen
      ? []
      : this.parse_arguments_list();

    this.expect(TokenType.CloseParen, `Expected close parenthesis`);
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
      this.expect(TokenType.CloseBracket, "Missing closing bracket");

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
        this.eat(); //Eat opening parenthesis
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesized expression. Expected closing parenthesis !!!",
        ); //Eat closing parenthesis
        return value;
      }
      case TokenType.OpenBrace: {
        this.eat(); //Eat opening parenthesis
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseBrace,
          "Unexpected token found inside parenthesized expression. Expected closing parenthesis !!!",
        ); //Eat closing parenthesis
        return value;
      }

      // Unary expression
      case TokenType.NotOperator:
        return this.parse_not_expr();

      default:
        throw `Unexpected token found while parsing: , ${this.at()}`;
    }
  }
}
