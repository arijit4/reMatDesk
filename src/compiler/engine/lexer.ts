import {Token} from "../../model/token";
import {isAlpha, isAlphaNumeric, isDigit, isNewline, isOperator} from "../../utils/charTypeTester";
import {Position} from "../../model/position";
import {TokenType} from "../../model/tokenType";
import {MError} from "../data_models/MError";

export class Lexer {
    input: string;
    currentLine: number = 1;
    currentIndex: number = 0;

    constructor(input: string) {
        this.input = input;
    }

    tokenize(): Token[] | MError {
        this.input = this.input.trim();
        const tokens: Token[] = [];

        while (this.currentIndex < this.input.length) {
            let newPosition = new Position(this.currentLine, this.currentIndex);
            const currentChar = this.currentChar();

            if (currentChar === ' ') {
                this.currentIndex++;
            } else if (currentChar === ';') {
                this.currentIndex++;
                newPosition.addToPosition();
                tokens.push(new Token(TokenType.SEMICOLON, ";", newPosition));
            } else if (currentChar === ',') {
                this.currentIndex++;
                newPosition.addToPosition();
                tokens.push(new Token(TokenType.COMMA, ",", newPosition));
            } else if (isDigit(currentChar)) {
                let numToken = this.generateNumberToken();
                this.currentIndex = numToken.position!.posEnd;
                tokens.push(numToken);
            } else if (currentChar === 'i') {
                this.currentIndex++;
                newPosition.addToPosition();
                tokens.push(new Token(TokenType.I_NUMBER, "1", newPosition));
            } else if (isAlpha(currentChar) || currentChar === '_') {
                tokens.push(this.generateIdentifierToken());
            } else if (isNewline(currentChar)) {
                this.currentIndex++
                newPosition.addToPosition();
                tokens.push(new Token(TokenType.NEWLINE, "\n", newPosition));
                this.currentLine++;
            } else if (currentChar === "=") {
                this.currentIndex++;
                newPosition.addToPosition();
                tokens.push(new Token(TokenType.EQUAL, "=", newPosition));
            } else if (isOperator(currentChar)) {
                this.currentIndex++;
                newPosition.addToPosition();

                let type = TokenType.PLUS;
                if (currentChar === '-') {
                    type = TokenType.MINUS;
                } else if (currentChar === '*') {
                    type = TokenType.MULTIPLY;
                } else if (currentChar === '/') {
                    type = TokenType.DIVIDE;
                } else if (currentChar === '^') {
                    type = TokenType.POWER;
                }
                tokens.push(new Token(type, currentChar, newPosition));
            } else if (currentChar === '.') {
                this.currentIndex++;
                newPosition.addToPosition();

                let nextChar = this.currentChar();
                if (nextChar === '+') {
                    return new MError("dot plus operator is not a valid operator in matlab");
                } else if (nextChar === '-') {
                    return new MError("dot minus operator is not a valid operator in matlab");
                } else if (nextChar === '*') {
                    this.currentIndex++;
                    newPosition.addToPosition();
                    tokens.push(new Token(TokenType.DOT_MULTIPLY, ".*", newPosition));
                } else if (nextChar === '/') {
                    this.currentIndex++;
                    newPosition.addToPosition();
                    tokens.push(new Token(TokenType.DOT_DIVIDE, "./", newPosition));
                } else if (nextChar === '^') {
                    this.currentIndex++;
                    newPosition.addToPosition();
                    tokens.push(new Token(TokenType.DOT_POWER, ".^", newPosition));
                }
            } else if (currentChar === '(') {
                this.currentIndex++;
                newPosition.addToPosition();
                tokens.push(new Token(TokenType.LEFT_PAREN, "(", newPosition));
            } else if (currentChar === ')') {
                this.currentIndex++;
                newPosition.addToPosition();
                tokens.push(new Token(TokenType.RIGHT_PAREN, ")", newPosition));
            } else if (currentChar === '[') {
                this.currentIndex++;
                newPosition.addToPosition();
                tokens.push(new Token(TokenType.LEFT_SQUARE_PAREN, "[", newPosition));
            } else if (currentChar === ']') {
                this.currentIndex++;
                newPosition.addToPosition();
                tokens.push(new Token(TokenType.RIGHT_SQUARE_PAREN, "]", newPosition));
            } else {
                return new MError(`Unexpected character '${currentChar}' at position ${this.currentLine}:${this.currentIndex}`);
            }
        }

        tokens.push(
            new Token(TokenType.EOF,
                "EOF",
                new Position(
                    this.currentLine,
                    this.currentIndex,
                )
            )
        );
        return tokens;
    }

    generateNumberToken(): Token {
        let num = "";
        let dotCount = 0;
        let newPosition = new Position(this.currentLine, this.currentIndex);

        while (this.indexInRange() && (isDigit(this.currentChar()) || this.currentChar() === '.' || this.currentChar() === 'i')) {
            if (this.currentChar() === 'i') {
                this.currentIndex++;
                newPosition.addToPosition();
                return new Token(
                    TokenType.I_NUMBER,
                    num,
                    newPosition
                );
            } else if (this.currentChar() === '.') {
                if (dotCount > 0) {
                    break;
                } else {
                    if (this.lookupNextChar() && isDigit(this.lookupNextChar()!)) {
                        dotCount++;

                        num += this.currentChar();
                        this.currentIndex++;
                        newPosition.addToPosition();
                    } else {
                        break;
                    }
                }
            } else {
                num += this.currentChar();
                this.currentIndex++;
                newPosition.addToPosition();
            }
        }
        return new Token(
            TokenType.NUMBER,
            num,
            newPosition
        );
    }

    generateIdentifierToken(): Token {
        let id = "";
        let newPosition = new Position(this.currentLine, this.currentIndex);

        while (isAlphaNumeric(this.currentChar()) || this.currentChar() === '_') {
            id += this.currentChar();
            this.currentIndex++;
            newPosition.addToPosition();
        }
        return new Token(
            TokenType.IDENTIFIER,
            id,
            newPosition
        );
    }

    private currentChar() {
        return this.input[this.currentIndex];
    }

    private lookupNextChar() {
        if (this.currentIndex + 1 < this.input.length) {
            return this.input[this.currentIndex + 1];
        }
        return undefined;
    }

    private indexInRange() {
        return this.currentIndex < this.input.length
    }
}