import {Token} from "../../model/token";
import {MAtom} from "../data_models/MAtom";
import {TokenType} from "../../model/tokenType";
import {MNumber} from "../data_models/MNumber";
import {DotMultiplyNode, MultiplyNode} from "../nodes/multiply_node";
import {DivisionNode, DotDivisionNode} from "../nodes/division_node";
import {PlusNode} from "../nodes/plus_node";
import {MinusNode} from "../nodes/minus_node";
import {DotPowerNode, PowerNode} from "../nodes/power_node";
import {FactorType, PowerFactorType, TermType} from "../centralTypes";
import {MError} from "../data_models/MError";
import {MNumberBuilder} from "../data_models/MNumberBuilder";

export class Parser {
    public tokens: Token[];
    public currentIndex: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public generateAST() {
        let currentToken = this.currentToken();
        if (currentToken.type === TokenType.NUMBER) {

        }
    }

    public parenthesisFactor(): TermType {
        if (this.currentToken().type === TokenType.LEFT_PAREN) {
            this.moveToNextToken();
            let n1: TermType = this.term();
            if (n1 instanceof MError) {
                return n1;
            }
            this.moveToNextToken();
            if (this.currentToken().type !== TokenType.RIGHT_PAREN) {
                return new MError(
                    `Expected a closing parenthesis at position 
                ${this.currentToken().position?.line}:${this.currentToken().position?.posStart}`
                );
            }
            return n1;
        }
        let n: PowerFactorType = this.getNumber();
        if (n instanceof MError) {
            return n;
        }
        return n;
    }

    public powerFactor(): PowerFactorType {
        let n1: TermType = this.parenthesisFactor();
        if (n1 instanceof MError) {
            return n1;
        }
        while (true) {
            this.moveToNextToken();

            if (this.currentToken().type !== TokenType.POWER && this.currentToken().type !== TokenType.DOT_POWER) {
                this.moveToPreviousToken();
                return n1;
            }
            let op = this.currentToken();
            this.moveToNextToken();

            let n2: PowerFactorType = this.parenthesisFactor();
            if (n2 instanceof MError) {
                return n2;
            }

            if (op.type === TokenType.POWER) {
                n1 = new PowerNode(n1, n2);
            } else if (op.type === TokenType.DOT_POWER) {
                n1 = new DotPowerNode(n1, n2);
            }
        }
    }


    public factor(): FactorType {
        let n1: FactorType = this.powerFactor();
        if (n1 instanceof MError) {
            return n1;
        }
        while (true) {
            this.moveToNextToken();

            let op = this.getBinaryOperator();
            if (!op) {
                this.moveToPreviousToken();
                return n1;
            }
            if (
                op.type === TokenType.PLUS ||
                op.type === TokenType.MINUS
            ) {
                this.moveToPreviousToken();
                return n1;
            }
            this.moveToNextToken();

            let n2: FactorType = this.powerFactor();
            if (n2 instanceof MError) {
                return n2;
            }

            if (op.type === TokenType.MULTIPLY) {
                n1 = new MultiplyNode(n1, n2);
            } else if (op.type === TokenType.DOT_MULTIPLY) {
                n1 = new DotMultiplyNode(n1, n2);
            } else if (op.type === TokenType.DIVIDE) {
                n1 = new DivisionNode(n1, n2);
            } else if (op.type === TokenType.DOT_DIVIDE) {
                n1 = new DotDivisionNode(n1, n2);
            }
        }
    }

    public term(): TermType {
        let n1: TermType = this.factor();
        if (n1 instanceof MError) {
            return n1;
        }
        while (true) {
            this.moveToNextToken();

            let op = this.getBinaryOperator();
            if (!op) {
                this.moveToPreviousToken();
                return n1;
            }
            if (
                op.type === TokenType.MULTIPLY ||
                op.type === TokenType.DOT_MULTIPLY ||
                op.type === TokenType.DIVIDE ||
                op.type === TokenType.DOT_DIVIDE
            ) {
                this.moveToPreviousToken();
                return n1;
            }
            this.moveToNextToken();

            let n2: FactorType = this.factor();
            if (n2 instanceof MError) {
                return n2;
            }
            if (op.type === TokenType.PLUS) {
                n1 = new PlusNode(n1, n2);
            } else if (op.type === TokenType.MINUS) {
                n1 = new MinusNode(n1, n2);
            }
        }
    }

    public currentToken() {
        return this.tokens[this.currentIndex];
    }

    public moveToNextToken() {
        this.currentIndex++;
    }

    public moveToPreviousToken() {
        this.currentIndex--;
    }

    public lookupNextToken() {
        try {
            return this.tokens[this.currentIndex + 1];
        } catch (error) {
            return null;
        }
    }

    // ============ Private Methods ============
    private getMatrix() {
        if (this.currentToken().type === TokenType.LEFT_SQUARE_PAREN) {
            let n = new MNumberBuilder();
            this.moveToNextToken();
            while (this.currentToken().type !== TokenType.RIGHT_SQUARE_PAREN
            && this.currentToken().type !== TokenType.EOF) {
                if (this.currentToken().type === TokenType.COMMA) {
                    this.moveToNextToken();
                }
                let a = this.term();
                if (a instanceof MError) {
                    return a;
                }
                n.push(a);
                this.moveToNextToken()
                if (this.currentToken().type === TokenType.SEMICOLON) {
                    n.addRow();
                    this.moveToNextToken();
                }
            }
            if (this.currentToken().type !== TokenType.RIGHT_SQUARE_PAREN) {
                return new MError(
                    "Expected a closing square parenthesis",
                    this.currentToken().position
                );
            }
            return n;
        }
        return new MError(
            "Expected a matrix",
            this.currentToken().position
        );
    }

    private getNumber() {
        if (this.currentToken().type === TokenType.LEFT_SQUARE_PAREN) {
            return this.getMatrix();
        }
        let sign = 1;

        while (this.currentToken().type === TokenType.PLUS || this.currentToken().type === TokenType.MINUS) {
            if (this.currentToken().type === TokenType.MINUS) {
                sign *= -1;
            }
            this.moveToNextToken();
        }
        let currentToken = this.currentToken();
        if (currentToken.type === TokenType.NUMBER) {
            return new MNumber(
                new MAtom(
                    parseFloat(currentToken.value) * sign,
                    0,
                    currentToken.position,
                    false
                )
            );
        } else if (currentToken.type === TokenType.I_NUMBER) {
            return new MNumber(
                new MAtom(
                    0,
                    parseFloat(currentToken.value) * sign,
                    currentToken.position,
                    false
                )
            );
        }
        return new MError(
            "Expected a number",
            currentToken.position
        );
    }

    private getBinaryOperator() {
        let currentToken = this.currentToken();
        if (
            currentToken.type === TokenType.PLUS ||
            currentToken.type === TokenType.MINUS ||
            currentToken.type === TokenType.MULTIPLY ||
            currentToken.type === TokenType.DIVIDE ||
            currentToken.type === TokenType.DOT_MULTIPLY ||
            currentToken.type === TokenType.DOT_DIVIDE
        ) {
            return currentToken;
        }
        return null;
    }
}