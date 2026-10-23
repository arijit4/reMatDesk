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
import {MatrixRangeNode} from "../nodes/matrix_range_node";

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

    public parenthesisFactor(isInMatrix: boolean): TermType {
        if (this.currentToken().type === TokenType.LEFT_PAREN) {
            this.moveToNextToken();
            this.ignoreSpaces();

            let n1: TermType = this.term(false);
            if (n1 instanceof MError) {
                return n1;
            }
            this.moveToNextToken();
            this.ignoreSpaces();
            if (this.currentToken().type !== TokenType.RIGHT_PAREN) {
                return new MError(
                    `Expected a closing parenthesis at position 
                    ${this.currentToken().position?.line}:${this.currentToken().position?.posStart}`
                );
            }
            return n1;
        }
        return this.getNumber();
    }

    public powerFactor(isInMatrix: boolean): PowerFactorType {
        let n1: PowerFactorType = this.parenthesisFactor(isInMatrix);

        if (n1 instanceof MError) {
            return n1;
        }

        let lastValidIndex = this.currentIndex;
        this.moveToNextToken();
        this.ignoreSpaces();

        if (this.getPowerOperator() === null) {
            this.currentIndex = lastValidIndex;
            return n1;
        }

        let op = this.getPowerOperator()!;
        this.moveToNextToken();
        this.ignoreSpaces();

        while (op !== null) {
            let n2 = this.parenthesisFactor(isInMatrix);
            this.moveToNextToken();
            this.ignoreSpaces();

            if (n2 instanceof MError) {
                return n2;
            }

            if (op.type === TokenType.POWER) {
                n1 = new PowerNode(n1, n2);
            } else if (op.type === TokenType.DOT_POWER) {
                n1 = new DotPowerNode(n1, n2);
            }

            op = this.getPowerOperator()!;
            if (op !== null) {
                this.moveToNextToken();
                this.ignoreSpaces();
            } else {
                this.moveToPreviousToken();
                return n1;
            }
        }
        return n1
    }

    public factor(isInMatrix: boolean): FactorType {
        let n1: FactorType = this.powerFactor(isInMatrix);
        if (n1 instanceof MError) {
            return n1;
        }

        let lastValidIndex = this.currentIndex;
        this.moveToNextToken();
        this.ignoreSpaces();

        if (this.getFactorOperator() === null) {
            this.currentIndex = lastValidIndex;
            return n1;
        }

        let op = this.getFactorOperator()!;
        this.moveToNextToken();
        this.ignoreSpaces();

        while (op !== null) {
            let n2 = this.powerFactor(isInMatrix);
            this.moveToNextToken();
            this.ignoreSpaces();

            if (n2 instanceof MError) {
                return n2;
            }

            if (op.type === TokenType.MULTIPLY) {
                n1 = new MultiplyNode(n1, n2);
            } else if (op.type === TokenType.DIVIDE) {
                n1 = new DivisionNode(n1, n2);
            } else if (op.type === TokenType.DOT_MULTIPLY) {
                n1 = new DotMultiplyNode(n1, n2);
            } else if (op.type === TokenType.DOT_DIVIDE) {
                n1 = new DotDivisionNode(n1, n2);
            }

            op = this.getFactorOperator()!;
            if (op !== null) {
                this.moveToNextToken();
                this.ignoreSpaces();
            } else {
                this.moveToPreviousToken();
                return n1;
            }
        }
        return n1
    }

    public term(isInMatrix: boolean): TermType {
        let n1: TermType = this.factor(isInMatrix);
        if (n1 instanceof MError) {
            return n1;
        }

        let lastValidIndex = this.currentIndex;
        this.moveToNextToken();
        if (isInMatrix && this.currentToken().type === TokenType.SPACE) {
            this.moveToPreviousToken();
            return n1;
        }
        this.ignoreSpaces();
        if (this.getTermOperator() === null) {
            this.currentIndex = lastValidIndex;
            return n1;
        }

        let op = this.getTermOperator()!;
        this.moveToNextToken();
        this.ignoreSpaces();

        while (op !== null) {
            let n2 = this.factor(isInMatrix);
            this.moveToNextToken();

            if (n2 instanceof MError) {
                return n2;
            }
            if (op.type === TokenType.PLUS) {
                n1 = new PlusNode(n1, n2);
            } else if (op.type === TokenType.MINUS) {
                n1 = new MinusNode(n1, n2);
            }
            if (isInMatrix && this.currentToken().type === TokenType.SPACE) {
                this.moveToPreviousToken();
                return n1;
            }
            this.ignoreSpaces();
            op = this.getTermOperator()!;
            if (op !== null) {
                this.moveToNextToken();
                this.ignoreSpaces();
            } else {
                this.moveToPreviousToken();
                return n1;
            }
        }
        return n1;
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
            this.ignoreSpaces();

            while (
                this.currentToken().type !== TokenType.RIGHT_SQUARE_PAREN
                && this.currentToken().type !== TokenType.EOF
                ) {
                let a = this.term(true);
                if (a instanceof MError) {
                    return a;
                }
                n.push(a);
                this.moveToNextToken();
                this.ignoreSpaces();

                if (this.currentToken().type === TokenType.COMMA) {
                    this.moveToNextToken();
                    this.ignoreSpaces();
                }
                if (this.currentToken().type === TokenType.SEMICOLON) {
                    n.addRow();
                    this.moveToNextToken();
                    this.ignoreSpaces();
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

    private getNumber(): FactorType {
        if (this.currentToken().type === TokenType.LEFT_SQUARE_PAREN) {
            return this.getMatrix();
        }
        let sign = new MNumber(
            new MAtom(
                1,
                0,
                this.currentToken().position
            )
        );
        while (
            this.currentToken().type === TokenType.PLUS
            || this.currentToken().type === TokenType.MINUS
            ) {
            if (this.currentToken().type === TokenType.MINUS) {
                sign.matrix[0][0].real *= -1;
            }
            this.moveToNextToken();
            this.ignoreSpaces();
        }
        let n: FactorType;
        if (this.currentToken().type === TokenType.NUMBER) {
            n = new MNumber(
                new MAtom(
                    sign.matrix[0][0].real * parseFloat(this.currentToken().value),
                    0,
                    this.currentToken().position
                )
            );
        } else if (this.currentToken().type === TokenType.I_NUMBER) {
            n = new MNumber(
                new MAtom(
                    0,
                    sign.matrix[0][0].real * parseFloat(this.currentToken().value),
                    this.currentToken().position
                )
            );
        } else if (this.currentToken().type !== TokenType.EOF) {
            n = new MultiplyNode(
                this.term(false),
                sign
            )
        } else {
            return new MError(
                "Expected a number",
                this.currentToken().position
            );
        }
        let lastValidIndex = this.currentIndex;
        this.moveToNextToken();
        this.ignoreSpaces();
        if (this.currentToken().type !== TokenType.COLON) {
            this.currentIndex = lastValidIndex;
            return n;
        }

        while (this.currentToken().type === TokenType.COLON) {
            this.moveToNextToken();
            this.ignoreSpaces();

            let n2 = this.term(false);
            if (n2 instanceof MError) {
                return n2;
            }

            if (n2 instanceof MatrixRangeNode) {
                if (n instanceof MatrixRangeNode) {
                    return new MError(
                        "both are range; should not reach here"
                    )
                } else {
                    if (n2.step !== null) {
                        return new MError(
                            "invalid matrix construction",
                            this.currentToken().position
                        )
                    }
                    n = new MatrixRangeNode(n, n2.start, n2.end);
                }
            } else {
                if (n instanceof MatrixRangeNode) {
                    return new MError(
                        "n range, n2 num; should not reach here"
                    )
                } else {
                    n = new MatrixRangeNode(n, n2)
                }
            }
            let lastValidIndex = this.currentIndex;
            this.moveToNextToken();
            this.ignoreSpaces();
            if (this.currentToken().type !== TokenType.COLON) {
                this.currentIndex = lastValidIndex;
                return n;
            }
        }
        return n;
    }

    private getPowerOperator() {
        if (this.currentIndex >= this.tokens.length) {
            return null;
        }
        let currentToken = this.currentToken();
        if (
            currentToken.type === TokenType.POWER ||
            currentToken.type === TokenType.DOT_POWER
        ) {
            return currentToken;
        }
        return null;
    }

    private getFactorOperator() {
        if (this.currentIndex >= this.tokens.length) {
            return null;
        }
        let currentToken = this.currentToken();
        if (
            currentToken.type === TokenType.MULTIPLY ||
            currentToken.type === TokenType.DIVIDE ||
            currentToken.type === TokenType.DOT_MULTIPLY ||
            currentToken.type === TokenType.DOT_DIVIDE
        ) {
            return currentToken;
        }
        return null;
    }

    private getTermOperator() {
        if (this.currentIndex >= this.tokens.length) {
            return null;
        }
        let currentToken = this.currentToken();
        if (
            currentToken.type === TokenType.PLUS ||
            currentToken.type === TokenType.MINUS
        ) {
            return currentToken;
        }
        return null;
    }

    private ignoreSpaces() {
        while (this.currentIndex < this.tokens.length && this.currentToken().type === TokenType.SPACE) {
            this.moveToNextToken();
        }
    }
}