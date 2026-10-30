import {Token} from "../../model/token";
import {MAtom} from "../data_models/MAtom";
import {TokenType} from "../../model/tokenType";
import {MNumber} from "../data_models/MNumber";
import {DotMultiplyNode, MultiplyNode} from "../nodes/arithmetics/multiply_node";
import {DivisionNode, DotDivisionNode} from "../nodes/arithmetics/division_node";
import {PlusNode} from "../nodes/arithmetics/plus_node";
import {MinusNode} from "../nodes/arithmetics/minus_node";
import {DotPowerNode, PowerNode} from "../nodes/arithmetics/power_node";
import {FactorType, PowerFactorType, TermType} from "../centralTypes";
import {MError} from "../data_models/MError";
import {MNumberBuilder} from "../data_models/MNumberBuilder";
import {MatrixRangeNode} from "../nodes/arithmetics/matrix_range_node";
import {VarAccessNode} from "../nodes/variables/var_access_node";
import {VarAssignmentNode} from "../nodes/variables/var_assignment_node";
import {EqualNode} from "../nodes/comparisons/equal_node";
import {NotEqualNode} from "../nodes/comparisons/not_equal_node";
import {LessThanNode} from "../nodes/comparisons/less_than_node";
import {GreaterThanNode} from "../nodes/comparisons/greater_than_node";
import {LessOrEqualNode} from "../nodes/comparisons/less_or_equal_node";
import {GreaterOrEqualNode} from "../nodes/comparisons/greater_or_equal_node";
import {KeywordType} from "../../model/keywordType";
import {ConditionBlock, IfElseNode} from "../nodes/condtions/if_else_node";

export class Parser {
    public tokens: Token[];
    public currentIndex: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public generateAST() {
        this.ignoreSpacesAndNewlines();

        let currentToken = this.currentToken();
        let lastValidIndex = this.currentIndex;
        this.moveToNextToken();
        this.ignoreSpaces();
        let secondToken = this.currentToken();

        if (currentToken.type === TokenType.IDENTIFIER && secondToken.type === TokenType.EQUAL) {
            this.moveToNextToken();
            this.ignoreSpaces();

            return new VarAssignmentNode(
                currentToken.value,
                this.comparison(false),
                currentToken.position
            )
        } else if (currentToken.type === TokenType.KEYWORD && currentToken.value === KeywordType.IF) {
            // no `moveToNextToken() as we have already advanced to the 2nd token
            this.currentIndex = lastValidIndex;
            return this.generateIfElseBlock();
        } else {
            this.currentIndex = lastValidIndex;
            return this.comparison(false);
        }
    }

    private getMatrix() {
        if (this.currentToken().type === TokenType.LEFT_SQUARE_PAREN) {
            let n = new MNumberBuilder();
            this.moveToNextToken();
            this.ignoreSpaces();

            while (
                this.currentToken().type !== TokenType.RIGHT_SQUARE_PAREN
                && this.currentToken().type !== TokenType.EOF
                ) {
                // let a = this.term(true);
                let a = this.comparison(true);
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
        this.ignoreSpacesAndNewlines();
        if (this.currentToken().type === TokenType.EOF) {
            return new MError(
                "Expected a number",
                this.currentToken().position
            );
        }
        if (this.currentToken().type === TokenType.EQUAL_EQUAL) {
            return new MError(
                `invalid '${this.currentToken().value}' operation`,
                this.currentToken().position
            );
        }
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
        let number_of_prefix_signs = 0;
        while (
            this.currentToken().type === TokenType.PLUS
            || this.currentToken().type === TokenType.MINUS
            ) {
            if (this.currentToken().type === TokenType.MINUS) {
                sign.matrix[0][0].real *= -1;
            }
            number_of_prefix_signs++;
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
        } else if (this.currentToken().type === TokenType.IDENTIFIER) {
            n = new MultiplyNode(
                sign,
                new VarAccessNode(
                    this.currentToken().value,
                    this.currentToken().position
                )
            );
        } else if (this.currentToken().type === TokenType.BOOLEAN) {
            if (number_of_prefix_signs > 0) {
                return new MError(
                    "invalid boolean sign",
                    this.currentToken().position
                );
            }
            n = new MNumber(
                new MAtom(
                    this.currentToken().value === KeywordType.TRUE ? 1 : 0,
                    0,
                    this.currentToken().position
                )
            );
        } else if (this.currentToken().type !== TokenType.EOF) {
            n = new MultiplyNode(
                this.parenthesisFactor(false),
                sign
            )
        } else {
            return new MError(
                "Unexpected end of input; expected a number, variable, matrix, or 'end' keyword",
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

            // let n2 = this.term(true);
            let n2 = this.comparison(true);
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

    public parenthesisFactor(isInMatrix: boolean): TermType {
        if (this.currentToken().type === TokenType.LEFT_PAREN) {
            this.moveToNextToken();
            this.ignoreSpaces();

            let n1: TermType = this.comparison(isInMatrix);
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

    public comparison(isInMatrix: boolean): TermType {
        let t1 = this.term(isInMatrix);
        if (t1 instanceof MError) {
            return t1;
        }
        let lastValidIndex = this.currentIndex;
        this.moveToNextToken();
        this.ignoreSpaces();

        if (
            this.currentToken().type === TokenType.EQUAL_EQUAL
        ) {
            this.moveToNextToken();
            this.ignoreSpaces();
            let t2 = this.term(isInMatrix);
            if (t2 instanceof MError) {
                return t2;
            }

            return new EqualNode(
                t1,
                t2
            );
        } else if (
            this.currentToken().type === TokenType.NOT_EQUAL
        ) {
            this.moveToNextToken();
            this.ignoreSpaces();
            let t2 = this.term(isInMatrix);
            if (t2 instanceof MError) {
                return t2;
            }

            return new NotEqualNode(
                t1,
                t2
            );
        } else if (
            this.currentToken().type === TokenType.LESS
        ) {
            this.moveToNextToken();
            this.ignoreSpaces();
            let t2 = this.term(isInMatrix);
            if (t2 instanceof MError) {
                return t2;
            }

            return new LessThanNode(
                t1,
                t2
            );
        } else if (
            this.currentToken().type === TokenType.LESS_OR_EQUAL
        ) {
            this.moveToNextToken();
            this.ignoreSpaces();
            let t2 = this.term(isInMatrix);
            if (t2 instanceof MError) {
                return t2;
            }

            return new LessOrEqualNode(
                t1,
                t2
            );
        } else if (
            this.currentToken().type === TokenType.GREATER
        ) {
            this.moveToNextToken();
            this.ignoreSpaces();
            let t2 = this.term(isInMatrix);
            if (t2 instanceof MError) {
                return t2;
            }

            return new GreaterThanNode(
                t1,
                t2
            );
        } else if (
            this.currentToken().type === TokenType.GREATER_OR_EQUAL
        ) {
            this.moveToNextToken();
            this.ignoreSpaces();
            let t2 = this.term(isInMatrix);
            if (t2 instanceof MError) {
                return t2;
            }

            return new GreaterOrEqualNode(
                t1,
                t2
            );
        }
        this.currentIndex = lastValidIndex;
        return t1;
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

    public generateIfElseBlock(): MError | IfElseNode {
        let ifConditionBlock = new ConditionBlock();
        let ifElseNode = new IfElseNode();
        let ifCount = 0;
        while (
            [KeywordType.IF, KeywordType.ELSEIF, KeywordType.ELSE].includes(this.currentToken().value)
            ) {
            let isElse = false;
            if (this.currentToken().value === KeywordType.IF) {
                ifCount++;
                // if
            }
            if (this.currentToken().value === KeywordType.ELSE) {
                // eat sneakers, do nothing
                isElse = true;
            } else {
                this.moveToNextToken();
                this.ignoreSpaces();

                let condition = this.comparison(false);
                if (condition instanceof MError) {
                    return condition;
                }
                ifConditionBlock.setCondition(condition);
            }
            this.moveToNextToken();
            this.ignoreSpacesAndNewlines();

            while (
                ![KeywordType.ELSEIF, KeywordType.ELSE, KeywordType.END].includes(this.currentToken().value)
                ) {
                let statement: FactorType | IfElseNode | MError = this.generateAST();
                if (statement instanceof MError) {
                    return statement;
                }
                ifConditionBlock.addStatements(statement);
                if (isElse) {
                    ifElseNode.setElseBlock(ifConditionBlock);
                } else {
                    ifElseNode.addConditionBlock(ifConditionBlock);
                }

                this.moveToNextToken();
                this.ignoreSpacesAndNewlines();
            }
            ifConditionBlock = new ConditionBlock();
        }
        if (this.currentToken().type === TokenType.KEYWORD && this.currentToken().value === KeywordType.END) {
            console.log(ifElseNode)
            return ifElseNode;
        }

        return new MError(
            "Invalid conditional expression; expected 'elseif', 'else' or 'end'",
            this.currentToken().position
        );
    }

    // ============ Private Helper Methods ============
    public lookupNextToken() {
        try {
            return this.tokens[this.currentIndex + 1];
        } catch (error) {
            return null;
        }
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
        while (this.currentIndex < this.tokens.length - 2 && this.currentToken().type === TokenType.SPACE) {
            this.moveToNextToken();
        }
    }

    private ignoreSpacesAndNewlines() {
        while (
            this.currentIndex < this.tokens.length - 1
            && (
                this.currentToken().type === TokenType.SPACE
                || this.currentToken().type === TokenType.NEWLINE
            )
            ) {
            this.moveToNextToken();
        }
    }
}