import {Executor} from "../compiler/engine/executor";
import {Parser} from "../compiler/engine/parser";
import {Lexer} from "../compiler/engine/lexer";

function getResult(input: string) {
    let lexer = new Lexer(input);
    let tokens = lexer.tokenize();
    let parser = new Parser(tokens);
    let x = parser.term();

    let executor = new Executor();
    return executor.execute(x);
}

function truncateToDecimals(num: number) {
    const factor = Math.pow(10, 8);
    return Math.trunc(num * factor) / factor;
}

describe('Scalar arithmetics', () => {
    let executor = new Executor();
    test('adds 3 numbers correctly', () => {
        let result = getResult("2 + 3 + 4");
        expect(result.matrix[0][0].real).toBe(2 + 3 + 4);
        expect(result.matrix[0][0].imaginary).toBe(0);
    });
    test('subtracts 3 numbers correctly', () => {
        let result = getResult("2 - 3 - 4");
        expect(result.matrix[0][0].real).toBe(2 - 3 - 4);
        expect(result.matrix[0][0].imaginary).toBe(0);
    });
    test('multiplies 3 scalar numbers correctly', () => {
        let result = getResult("2 .* 3 .* 4");
        expect(result.matrix[0][0].real).toBe(2 * 3 * 4);
        expect(result.matrix[0][0].imaginary).toBe(0);
    });
    test('divides 3 scalar numbers correctly', () => {
        let result = getResult("2 ./ 3 ./ 4");
        expect(result.matrix[0][0].real).toBe(2 / 3 / 4);
        expect(result.matrix[0][0].imaginary).toBe(0);
    });
    test('powers 3 scalar numbers correctly', () => {
        let result = getResult("2 ^ 0.5 ^ 2 ^ 3");
        expect(result.matrix[0][0].real).toBe(((2 ** 0.5) ** 2) ** 3);
        expect(result.matrix[0][0].imaginary).toBe(0);
    });
});
