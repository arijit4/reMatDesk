import {MAtom} from "./MAtom";
import {MError} from "./MError";
import {Executor} from "../engine/executor";

export class MNumber {
    public matrix: (MAtom)[][];
    public dimensions = {row: 0, column: 0};
    private currentlyBuildingRow = 0;

    constructor(
        value: MAtom | null
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
        this.currentlyBuildingRow++;
    }

    push(
        value: MAtom | MNumber
    ) {
        if (this.dimensions.row === 0) {
            this.addRow();
        }

        if (value instanceof MAtom) {
            this.matrix[this.currentlyBuildingRow - 1].push(value);
        } else {
            let oldRow = this.currentlyBuildingRow;
            for (let i = 0; i < value.dimensions.row; i++) {
                if (i > 0) {
                    this.addRow();
                }
                for (let j = 0; j < value.dimensions.column; j++) {
                    this.matrix[(oldRow - 1) + i].push(value.matrix[i][j]);
                }
            }
            this.currentlyBuildingRow = oldRow;
        }
        if (this.dimensions.row === 1) {
            this.dimensions.column = this.matrix[0].length;
        } else {
            this.dimensions.column = this.matrix[this.dimensions.row - 1].length
        }
    }

    print() {
        for (let i = 0; i < this.dimensions.row; i++) {
            let row = this.matrix[i];
            let rowString = row.map(
                atom => `${atom.real}${atom.imaginary !== 0 ? ` + ${atom.imaginary === 1 ? '' : atom.imaginary}i` : ''}`
            ).join('\t');
            console.log(`\t${rowString}`);
        }
    }

    add(other: MNumber): MNumber | MError {
        if (this.isScalar()) {
            let scalar = this.matrix[0][0];
            let result = new MNumber(null);
            for (let i = 0; i < other.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < other.dimensions.column; j++) {
                    result.push(scalar.add(other.matrix[i][j]));
                }
            }
            return result;
        } else if (other.isScalar()) {
            let scalar = other.matrix[0][0];
            let result = new MNumber(null);
            for (let i = 0; i < this.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < this.dimensions.column; j++) {
                    result.push(scalar.add(this.matrix[i][j]));
                }
            }
            return result;
        }
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
            return new MError(
                "Matrix dimensions must match for addition.",
                null
            );
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            result.addRow();
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].add(other.matrix[i][j]));
            }
        }
        return result;
    }

    subtract(other: MNumber): MNumber | MError {
        if (this.isScalar()) {
            let scalar = this.matrix[0][0];
            let result = new MNumber(null);
            for (let i = 0; i < other.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < other.dimensions.column; j++) {
                    result.push(scalar.subtract(other.matrix[i][j]));
                }
            }
            return result;
        } else if (other.isScalar()) {
            let scalar = other.matrix[0][0];
            let result = new MNumber(null);
            for (let i = 0; i < this.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < this.dimensions.column; j++) {
                    let tmp = this.matrix[i][j];
                    result.push(tmp.subtract(scalar));
                }
            }
            return result;
        }
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
           return new MError("Matrix dimensions must match for subtraction.", null);
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            result.addRow();
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].subtract(other.matrix[i][j]));
            }
        }
        return result;
    }

    multiply(other: MNumber): MNumber | MError {
        if (this.isScalar()) {
            let scalar = this.matrix[0][0];
            let result = new MNumber(null);
            for (let i = 0; i < other.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < other.dimensions.column; j++) {
                    result.push(scalar.multiply(other.matrix[i][j]));
                }
            }
            return result;
        } else if (other.isScalar()) {
            let scalar = other.matrix[0][0];
            let result = new MNumber(null);
            for (let i = 0; i < this.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < this.dimensions.column; j++) {
                    result.push(scalar.multiply(this.matrix[i][j]));
                }
            }
            return result;
        } else {
            if (this.dimensions.column !== other.dimensions.row) {
                return new MError("Matrix dimensions must match for multiplication.", null);
            }

            let result = new MNumber(null);
            for (let i = 0; i < this.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < other.dimensions.column; j++) {
                    let sum = new MAtom(0, 0, null, false);
                    for (let k = 0; k < this.dimensions.column; k++) {
                        sum = sum.add(this.matrix[i][k].multiply(other.matrix[k][j]));
                    }
                    result.push(sum);
                }
            }
            return result;
        }
    }

    divide(other: MNumber): MNumber | MError {
        if (other.isScalar()) {
            let scalar = other.matrix[0][0];
            let result = new MNumber(null);
            for (let i = 0; i < this.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < this.dimensions.column; j++) {
                    result.push(this.matrix[i][j].divide(scalar));
                }
            }
            return result;
        }
        // TODO: Implement matrix division (e.g., using matrix inversion or other methods)
        return new MError("matrix/matrix is not implemented yet", null);
    }

    dotMultiply(other: MNumber): MNumber | MError {
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
            return new MError("Matrix dimensions must match for dot multiplication.", null);
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            result.addRow();
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].multiply(other.matrix[i][j]));
            }
        }
        return result;
    }

    dotDivide(other: MNumber): MNumber | MError {
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
            return new MError("Matrix dimensions must match for dot division.", null);
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            result.addRow();
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].divide(other.matrix[i][j]));
            }
        }
        return result;
    }

    dotToThePowerOf(other: MNumber): MNumber | MError {
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
            return new MError("Matrix dimensions must match for dot power.", null);
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            result.addRow();
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].toThePowerOf(other.matrix[i][j]));
            }
        }
        return result;
    }

    scalarPower(other: MNumber): MNumber | MError {
        let result = new MNumber(null);

        if (this.isScalar()) {
            let s = this.matrix[0][0];
            for (let i = 0; i < other.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < other.dimensions.column; j++) {
                    result.push(s.toThePowerOf(other.matrix[i][j]));
                }
            }
        } else {
            let s = other.matrix[0][0];
            for (let i = 0; i < this.dimensions.row; i++) {
                result.addRow();
                for (let j = 0; j < this.dimensions.column; j++) {
                    result.push(this.matrix[i][j].toThePowerOf(s));
                }
            }
        }
        return result;
    }

    equals(other: MNumber): MNumber | MError {
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
            return new MError("Matrix dimensions must match for equality comparison.", null);
        }
        let result = new MNumber(null);

        for (let i = 0; i < this.dimensions.row; i++) {
            result.addRow();
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].equals(other.matrix[i][j]));
            }
        }
        return result.validate();
    }

    execute(_: Executor): MNumber {
        return this;
    }

    isScalar() {
        return this.dimensions.row === 1 && this.dimensions.column === 1;
    }

    validate(): MNumber | MError {
        // clean up empty rows
        this.matrix = this.matrix.filter(row => row.length > 0);
        this.dimensions.row = this.matrix.length;
        this.dimensions.column = this.matrix.length > 0 ? this.matrix[0].length : 0;

        // check if all rows have the same number of columns
        for (let i = 0; i < this.dimensions.row; i++) {
            if (this.matrix[i].length !== this.dimensions.column) {
                return new MError("Inconsistent matrix dimensions");
            }
        }
        return this;
    }
}