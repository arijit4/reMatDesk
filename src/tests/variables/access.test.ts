import {MNumber} from "../../compiler/data_models/MNumber";
import {getResult} from "../testRunner";

describe('Variable access', () => {
    test('variable access', () => {
        let result = getResult("pi + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(Math.PI + 1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('prefix sign handling', () => {
        let result = getResult("-pi + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(-Math.PI + 1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("(-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(-Math.PI + 1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});
