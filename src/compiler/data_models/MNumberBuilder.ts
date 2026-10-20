import {TermType} from "../centralTypes";
import {MNumber} from "./MNumber";
import {Executor} from "../engine/executor";
import {MError} from "./MError";

export class MNumberBuilder {
    public matrix: (TermType)[][];
    public dimensions = {row: 0, column: 0};

    constructor(
        value: TermType | null = null
    ) {
        if (value) {
            this.matrix = [[value]];
            this.dimensions.row = 1;
            this.dimensions.column = 1;
        } else {
            this.matrix = [];
        }
    }

    addRow() {
        this.matrix.push([]);
        this.dimensions.row++;
    }

    push(
        value: TermType
    ) {
        if (this.dimensions.row === 0) {
            this.addRow();
        }

        this.matrix[this.dimensions.row - 1].push(value);
        this.dimensions.column = Math.max(
            this.dimensions.column,
            this.matrix[this.dimensions.row - 1].length
        );
    }

    execute(e: Executor): MNumber | MError {
        let n = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            if (this.matrix[i].length === 0) {
                continue;
            }
            n.addRow();
            for (let j = 0; j < this.dimensions.column; j++) {
                let term = this.matrix[i][j];
                if (term === undefined) { // i dont know why this is undefined, but it happens when the matrix is malformed, like [1 2; 3]
                    return new MError("Malformed matrix");
                } else if (term instanceof MError) {
                    return term;
                } else if (term instanceof MNumber) {
                    n.push(term.matrix[0][0]);
                } else {
                    let result = term.execute(e);

                    if (result instanceof MError) {
                        return result;
                    } else if (result instanceof MNumber) {
                        n.push(result.matrix[0][0]); // assuming result is a scalar MNumber
                    } else {
                        return new MError(`Unexpected result type: ${typeof result}`);
                    }
                }
            }
        }
        return n.validate();
    }
}