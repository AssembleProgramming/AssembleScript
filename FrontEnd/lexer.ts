/**
 * Represents the type of a token.
 */
export enum TokenType {
  // Literal types
  Null,
  Number,
  Identifier,
  String,
  // Keywords
  NewAvenger,
  NewEternal,
  Worthy,
  Otherwise,
  FightUntil,
  EndGame,
  Team,
  ElementType,
  Multiverse,
  Madness,
  Default,
  Minus,
  WakandaForEach,
  WakandaFor,
  In,
  To,
  Step,
  Assemble,
  Snap,
  // Operators + Other tokens
  Equals,
  Semicolon,
  Comma,
  Dot,
  Colon,
  BinaryOperator,
  LogicalOperator,
  ComparisonOperator,
  NotOperator,
  OpenParen, // (
  CloseParen, // )
  OpenBrace, // {
  CloseBrace, // }
  OpenBracket, // [
  CloseBracket, // ]
  //Easter eggs
  If,
  Else,
  While,
  For,
  Switch,
  Case,
  Let,
  Const,
  Return,
  Break,
  True,
  False,

  // End of the file token
  EOF,
}

/**
 * Reserved Keywords
 */
const KEYWORDS: Record<string, TokenType> = {
  newAvenger: TokenType.NewAvenger,
  newEternal: TokenType.NewEternal,
  ifWorthy: TokenType.Worthy,
  otherwise: TokenType.Otherwise,
  null: TokenType.Null,
  fightUntil: TokenType.FightUntil,
  endGame: TokenType.EndGame,
  team: TokenType.Team,
  multiverse: TokenType.Multiverse,
  madness: TokenType.Madness,
  default: TokenType.Default,
  wakandaForEach: TokenType.WakandaForEach,
  wakandaFor: TokenType.WakandaFor,
  in: TokenType.In,
  to: TokenType.To,
  step: TokenType.Step,
  and: TokenType.LogicalOperator,
  or: TokenType.LogicalOperator,
  assemble: TokenType.Assemble,
  snap: TokenType.Snap,
  //? Easter Egg 🥚
  if: TokenType.If,
  else: TokenType.Else,
  while: TokenType.While,
  for: TokenType.For,
  switch: TokenType.Switch,
  case: TokenType.Case,
  let: TokenType.Let,
  const: TokenType.Const,
  return: TokenType.Return,
  break: TokenType.Break,
  true: TokenType.True,
  false: TokenType.False,
};

/**
 * A token in the source code.
 */
export interface Token {
  value: string;
  type: TokenType;
  curr_line: number;
}

/**
 * Tokenizes the given source code.
 * @param sourceCode - The source code to tokenize.
 * @returns An array of tokens representing the source code.
 */
export function tokenize(sourceCode: string): Token[] {
  let line_cnt: number = 1;
  const tokens: Token[] = [];
  // Split the source code into individual characters
  const src = sourceCode.split("");
  /**
   * Retrieves a token with the specified value and type.
   * @param value - The string value of the token.
   * @param type - The type of the token.
   * @returns The token with the specified value and type.
   */
  function getToken(value = "", type: TokenType, curr_line: number): Token {
    return { value, type, curr_line };
  }

  /**
   * Checks if the provided string represents a number.
   * @param src - The string to check.
   * @returns True if the string represents a number, false otherwise.
   */
  function isNum(src: string): boolean {
    const c = src.charCodeAt(0);
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    const decimalPoint = ".".charCodeAt(0);
    const exponentChars = ["e", "E"];
    return (
      (c >= bounds[0] && c <= bounds[1]) ||
      c === decimalPoint ||
      exponentChars.includes(src)
    );
  }

  /**
   * Checks if the provided string represents a valid identifier.
   * @param src - The string to check.
   * @returns True if the string represents a valid identifier, false otherwise.
   */
  function isAlphabet(src: string): boolean {
    const c = src.charCodeAt(0);
    const underscore = "_".charCodeAt(0);
    return src.toUpperCase() !== src.toLowerCase() || c === underscore;
  }

  /**
   * Gets a multi-character token if it matches any of the known operators.
   * @param src - The source code characters.
   * @returns The token if it matches any operator, null otherwise.
   */
  function getMultiCharacterToken(src: string[]): Token | null {
    const operators: Record<string, TokenType> = {
      "<MINUS>": TokenType.Minus,
      "<=": TokenType.ComparisonOperator,
      ">=": TokenType.ComparisonOperator,
      "==": TokenType.ComparisonOperator,
      "!=": TokenType.ComparisonOperator,
      "<": TokenType.ComparisonOperator,
      ">": TokenType.ComparisonOperator,
      "&&": TokenType.LogicalOperator,
      "||": TokenType.LogicalOperator,
    };

    for (const operator in operators) {
      if (src.slice(0, operator.length).join("") === operator) {
        src.splice(0, operator.length);
        return getToken(operator, operators[operator], line_cnt);
      }
    }

    if (src[0] === "=") {
      // Handle single "=" as a separate token
      src.shift();
      return getToken("=", TokenType.Equals, line_cnt);
    }

    if (src[0] === '"') {
      src.shift(); // Consume the opening double quote
      let string = "";

      while (src.length > 0 && src[0] !== '"') {
        string += src.shift();
      }

      if (src[0] === '"') {
        src.shift(); // Consume the closing double quote
        return getToken(string, TokenType.String, line_cnt);
      } else {
        throw `SyntaxError:line:${line_cnt}: missing terminating '"' character.`;
      }
    }

    if (src[0] === "'") {
      src.shift(); // Consume the opening double quote
      let string = "";

      while (src.length > 0 && src[0] !== "'") {
        string += src.shift();
      }

      if (src[0] === "'") {
        src.shift(); // Consume the closing double quote
        return getToken(string, TokenType.String, line_cnt);
      } else {
        throw `SyntaxError:line:${line_cnt}: missing terminating ''' character.`;
      }
    }

    return null;
  }

  /**
   * Checks if the provided string represents a skippable character.
   * @param src - The string to check.
   * @returns True if the string represents a skippable character, false otherwise.
   */
  function isSkippable(src: string): boolean {
    if (src === "\n") {
      line_cnt = line_cnt + 1;
    }
    return (
      src === " " || src === "\n" || src === "\t" || src === "\r" || src === '"'
    );
  }
  // Build tokens until end of file
  while (src.length > 0) {
    if (src[0] === "$") {
      let comment = "";
      comment += src.shift();
      while (src.length > 0 && src[0] !== "$") {
        if (src[0] === "\n") {
          line_cnt = line_cnt + 1;
        }
        comment += src.shift();
      }
      comment += src.shift();
    } else if (src[0] === "#") {
      let comment = "";
      comment += src.shift();
      while (src.length > 0 && src[0] !== "\n") {
        comment += src.shift();
      }
      line_cnt = line_cnt + 1;
      comment += src.shift();
    } else if (src[0] === "(") {
      tokens.push(getToken(src.shift(), TokenType.OpenParen, line_cnt));
    } else if (src[0] === ")") {
      tokens.push(getToken(src.shift(), TokenType.CloseParen, line_cnt));
    } else if (src[0] === "{") {
      tokens.push(getToken(src.shift(), TokenType.OpenBrace, line_cnt));
    } else if (src[0] === "}") {
      tokens.push(getToken(src.shift(), TokenType.CloseBrace, line_cnt));
    } else if (src[0] === "[") {
      tokens.push(getToken(src.shift(), TokenType.OpenBracket, line_cnt));
    } else if (src[0] === "]") {
      tokens.push(getToken(src.shift(), TokenType.CloseBracket, line_cnt));
    } else if (
      src[0] === "+" ||
      src[0] === "-" ||
      src[0] === "*" ||
      src[0] === "/" ||
      src[0] === "%" ||
      src[0] === "^"
    ) {
      tokens.push(getToken(src.shift(), TokenType.BinaryOperator, line_cnt));
    } else if (src[0] === ";") {
      tokens.push(getToken(src.shift(), TokenType.Semicolon, line_cnt));
    } else if (src[0] === "!") {
      tokens.push(getToken(src.shift(), TokenType.NotOperator, line_cnt));
    } else if (src[0] === ":") {
      tokens.push(getToken(src.shift(), TokenType.Colon, line_cnt));
    } else if (src[0] === ",") {
      tokens.push(getToken(src.shift(), TokenType.Comma, line_cnt));
    } else if (src[0] === ".") {
      tokens.push(getToken(src.shift(), TokenType.Dot, line_cnt));
    } else {
      const token = getMultiCharacterToken(src);
      if (token) {
        tokens.push(token);
      } // Check for identifiers
      else if (isAlphabet(src[0])) {
        let id = "";
        while (src.length > 0 && isAlphabet(src[0])) {
          id += src.shift();
        }
        // Check for keywords
        const reserved: TokenType = KEYWORDS[id];
        if (typeof reserved === "number") {
          tokens.push(getToken(id, reserved, line_cnt));
        } else {
          // unreserved means user defined identifier
          tokens.push(getToken(id, TokenType.Identifier, line_cnt));
        }
      } // Build number token
      else if (isNum(src[0])) {
        let num = "";
        while (src.length > 0 && isNum(src[0])) {
          num += src.shift();
        }

        tokens.push(getToken(num, TokenType.Number, line_cnt));
      } // Skip the skippable character
      else if (isSkippable(src[0])) {
        // Skip the current character
        src.shift();
      } // Handle unrecognized characters
      else {
        throw `SyntaxError:line:${line_cnt}: Unrecognised character ${
          src[0]
        } found.`;
      }
    }
  }

  // Push EOF token
  tokens.push({ type: TokenType.EOF, value: "EndOfFile", curr_line: line_cnt });
  return tokens;
}
