import {MNumber} from "../../compiler/data_models/MNumber";
import {getResult} from "../testRunner";


function round(num: number, place: number = 8) {
    const factor = Math.pow(10, place);
    return Math.trunc(num * factor) / factor;
}

describe('Scalar arithmetics', () => {
    // addition
    test('adds 3 numbers correctly', () => {
        let result  = getResult("2 + 3 + 4").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 + 3 + 4);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('adds 3 imaginary numbers correctly', () => {
        let result = getResult("2i + 3i + 4i").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(2 + 3 + 4);
        }
    });
    // subtraction
    test('subtracts 3 numbers correctly', () => {
        let result = getResult("2 - 3 - 4").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 - 3 - 4);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('subtracts 3 imaginary numbers correctly', () => {
        let result = getResult("2i - 3i - 4i").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(2 - 3 - 4);
        }
    });
    // multiplication
    test('multiplies 3 scalar numbers correctly', () => {
        let result = getResult("2 * 3 * 4").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 * 3 * 4);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('multiplies 3 imaginary numbers correctly', () => {
        let result = getResult("2i * 3i * 4i").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(-2 * 3 * 4);
        }
    });
    test('multiplication with parenthesis', () => {
        let result = getResult("2 + (4 * 6)").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 + (4 * 6));
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    // division
    test('divides 3 scalar numbers correctly', () => {
        let result = getResult("2 / 3 / 4").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 / 3 / 4);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('divides 3 imaginary numbers correctly', () => {
        let result = getResult("2i / 3i / 4i").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(-2 / 3 / 4);
        }
    });
    test('division with parenthesis', () => {
        let result = getResult("2/ (4 / 6)").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(2 / (4 / 6));
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    // power
    test('powers 3 scalar numbers correctly', () => {
        let result = getResult("2 ^ 0.5 ^ 2 ^ 3").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(((2 ** 0.5) ** 2) ** 3);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('powers 3 imaginary numbers correctly', () => {
        let result = getResult("2i ^ 0.5i ^ 2 ^ 3i").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(round(result.matrix[0][0].real)).toBe(round(0));
            expect(round(result.matrix[0][0].imaginary)).toBe(round(0.125));
        }
    });

    // complex expression
    test('complex expression', () => {
        let result = getResult("2^2^2 * 3^3^3 +( 207 + (40000+ (2*100000 + 10^7*4) + 4*10^8 + 87799*10^10) + 1)").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(877990440555136);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });

    // sign handling
    test('sign before number', () => {
        let result = getResult("-3").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(-3);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('sign before imaginary number', () => {
        let result = getResult("-3i").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(-3);
        }
    });
    test('sign before parenthesis', () => {
        let result = getResult("-(3 - 2)").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(-1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('sign before matrix', () => {
        let result = getResult("-(3 - 2)").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(-1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});
