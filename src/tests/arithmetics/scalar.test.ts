import {Executor} from "../../compiler/engine/executor";
import {Parser} from "../../compiler/engine/parser";
import {Lexer} from "../../compiler/engine/lexer";
import {MNumber} from "../../compiler/data_models/MNumber";
import {MError} from "../../compiler/data_models/MError";

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

function round(num: number, place: number = 8) {
    const factor = Math.pow(10, place);
    return Math.trunc(num * factor) / factor;
}

describe('Scalar arithmetics', () => {
    // addition
    test('adds 3 numbers correctly', () => {
        let result  = getResult("2 + 3 + 4");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 + 3 + 4);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('adds 3 imaginary numbers correctly', () => {
        let result = getResult("2i + 3i + 4i");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(2 + 3 + 4);
        }
    });
    // subtraction
    test('subtracts 3 numbers correctly', () => {
        let result = getResult("2 - 3 - 4");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 - 3 - 4);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('subtracts 3 imaginary numbers correctly', () => {
        let result = getResult("2i - 3i - 4i");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(2 - 3 - 4);
        }
    });
    // multiplication
    test('multiplies 3 scalar numbers correctly', () => {
        let result = getResult("2 .* 3 .* 4");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 * 3 * 4);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('multiplies 3 imaginary numbers correctly', () => {
        let result = getResult("2i .* 3i .* 4i");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(-2 * 3 * 4);
        }
    });
    test('multiplication with parenthesis', () => {
        let result = getResult("2 + (4 .* 6)");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 + (4 * 6));
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    // division
    test('divides 3 scalar numbers correctly', () => {
        let result = getResult("2 ./ 3 ./ 4");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 / 3 / 4);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('divides 3 imaginary numbers correctly', () => {
        let result = getResult("2i ./ 3i ./ 4i");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(-2 / 3 / 4);
        }
    });
    test('division with parenthesis', () => {
        let result = getResult("2 ./ (4 ./ 6)");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 / (4 / 6));
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    // exponentiation
    test('powers 3 scalar numbers correctly', () => {
        let result = getResult("2 ^ 0.5 ^ 2 ^ 3");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(((2 ** 0.5) ** 2) ** 3);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('powers 3 imaginary numbers correctly', () => {
        let result = getResult("2i ^ 0.5i ^ 2 ^ 3i");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(round(result.matrix[0][0].real)).toBe(round(0));
            expect(round(result.matrix[0][0].imaginary)).toBe(round(0.125));
        }
    });
});
