import {MError} from "../../compiler/data_models/MError";
import {getResult} from "../testRunner";


describe('Comparison operations', () => {
    test('Missing right operand', () => {
        let result = getResult("3^3 == ").result;
        expect(result).toBeInstanceOf(MError);
    });
    test('Missing left operand', () => {
        let result = getResult(" == 28").result;
        expect(result).toBeInstanceOf(MError);
    });
    test('comparison with matrix', () => {
        let result = getResult("[1 3; 2 4] == [ 1 2; 3]").result;
        expect(result).toBeInstanceOf(MError);
    });
});
