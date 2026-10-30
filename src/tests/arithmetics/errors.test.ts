import {MError} from "../../compiler/data_models/MError";
import {getResult} from "../testRunner";

describe('Scalar arithmetics errors', () => {
    test('no number after an operand', () => {
        let result = getResult("2 + ").result;
        expect(result).toBeInstanceOf(MError);
    });
    test('no closing bracket', () => {
        let result = getResult("2 + (3").result
        expect(result).toBeInstanceOf(MError);
    });
    test('unexpected character', () => {
        let result = getResult("4 @ 5").result
        expect(result).toBeInstanceOf(MError);
    });
    test('incomplete matrix', () => {
        let result = getResult("[2, 3").result
        expect(result).toBeInstanceOf(MError);
    });
    test('more than 2 colons', () => {
        let result = getResult("2:4:10:15").result
        expect(result).toBeInstanceOf(MError);
    });
    test('incomplete range [a:]', () => {
        let result = getResult("2:").result
        expect(result).toBeInstanceOf(MError);
    });
    test('incomplete range [a:b:]', () => {
        let result = getResult("2:4:").result
        expect(result).toBeInstanceOf(MError);
    });
});
