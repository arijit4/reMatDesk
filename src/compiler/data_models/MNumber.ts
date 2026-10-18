import {MAtom} from "./MAtom";

export class MNumber {
    public matrix: (MAtom)[][];
    public dimensions = {row: 0, column: 0};

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
    }

    push(
        value: MAtom
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

    print() {
        for (let i = 0; i < this.dimensions.row; i++) {
            let row = this.matrix[i];
            let rowString = row.map(atom => `${atom.real}${atom.imaginary !== 0 ? ` + ${atom.imaginary === 1 ? '' : atom.imaginary}i` : ''}`).join(', ');
            console.log(`[${rowString}]`);
        }
    }

    add(other: MNumber): MNumber {
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
            throw new Error("Matrix dimensions must match for addition.");
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].add(other.matrix[i][j]));
            }
        }
        return result;
    }

    subtract(other: MNumber): MNumber {
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
            throw new Error("Matrix dimensions must match for subtraction.");
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].subtract(other.matrix[i][j]));
            }
        }
        return result;
    }

    dotMultiply(other: MNumber): MNumber {
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
            throw new Error("Matrix dimensions must match for dot multiplication.");
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].multiply(other.matrix[i][j]));
            }
        }
        return result;
    }

    dotDivide(other: MNumber): MNumber {
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
            throw new Error("Matrix dimensions must match for dot division.");
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].divide(other.matrix[i][j]));
            }
        }
        return result;
    }

    dotToThePowerOf(other: MNumber): MNumber {
        if (this.dimensions.row !== other.dimensions.row || this.dimensions.column !== other.dimensions.column) {
            throw new Error("Matrix dimensions must match for dot power.");
        }

        let result = new MNumber(null);
        for (let i = 0; i < this.dimensions.row; i++) {
            for (let j = 0; j < this.dimensions.column; j++) {
                result.push(this.matrix[i][j].toThePowerOf(other.matrix[i][j]));
            }
        }
        return result;
    }

    scalarPower(other: MNumber): MNumber {
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

    execute() {
        return this;
    }

    isScalar() {
        return this.dimensions.row === 1 && this.dimensions.column === 1;
    }
}