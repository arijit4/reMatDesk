import {Lexer} from "../../compiler/engine/lexer";
import {MError} from "../../compiler/data_models/MError";
import {Parser} from "../../compiler/engine/parser";
import {Executor} from "../../compiler/engine/executor";
import {MNumber} from "../../compiler/data_models/MNumber";

function getResult(input: string) {
    let lexer = new Lexer(input);
    let tokens = lexer.tokenize();
    if (tokens instanceof MError) {
        return tokens;
    }
    let parser = new Parser(tokens);
    let x = parser.term();

    let executor = new Executor();
    return executor.execute(x!);
}

describe('Matrix arithmetics', () => {
    // matrix build
    test('matrix build with comma', () => {
        let result = getResult("[1+3i,-3.123; 4+2 5]");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(1);
            expect(result.matrix[0][0].imaginary).toBe(3);

            expect(result.matrix[0][1].real).toBe(-3.123);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(4 + 2);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(5);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });

    // matrix addition
    test('matrix addition [matrix + matrix]', () => {
        let result = getResult("[1 2; 3 4] + [5 6; 7 8]");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(1 + 5);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(2 + 6);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(3 + 7);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(4 + 8);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('matrix addition [scalar + matrix]', () => {
        let result = getResult("1 + [5 6; 7 8]");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(6);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(7);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(8);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(9);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('matrix addition [matrix + scalar]', () => {
        let result = getResult("[1 2; 3 4] + 1");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(2);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(3);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(4);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(5);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });

    // matrix subtraction
    test('matrix subtraction [matrix - matrix]', () => {
        let result = getResult("[1 2; 3 4] - [5 6; 7 8]");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(-4);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(-4);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(-4);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(-4);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('matrix subtraction [scalar - matrix]', () => {
        let result = getResult("0 - [5 6; 7 8]");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(-5);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(-6);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(-7);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(-8);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('matrix subtraction [matrix - scalar]', () => {
        let result = getResult("[1 2; 3 4] - 1");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(1);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(2);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(3);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });

    // matrix multiplication
    test('matrix cross multiplication', () => {
        let result = getResult("[2 3; 4 5] * [2 3; 4 5]");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(16);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(21);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(28);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(37);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('matrix scalar multiplication [scalar * matrix]', () => {
        let result = getResult("2 * [2 3; 4 5]");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(4);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(6);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(8);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(10);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('matrix scalar multiplication [matrix * scalar]', () => {
        let result = getResult("[2 3; 4 5] * 2");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(4);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(6);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(8);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(10);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('matrix elementwise multiplication', () => {
        let result = getResult("[2 3; 4 5] .* [2 3; 4 5]");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBe(4);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBe(9);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBe(16);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBe(25);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
});
