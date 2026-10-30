import {MError} from "../../compiler/data_models/MError";
import {getResult} from "../testRunner";

describe('Scalar arithmetics errors', () => {
    test('identifier not defined', () => {
        let result = getResult("x + y").result
        expect(result).toBeInstanceOf(MError);
    });

    // TODO
    // test('invalid var name', () => {
    //     let result = getResult("2x = 5").result
    //     expect(result).toBeInstanceOf(MError);
    // });
});
