import {MNumber} from "../../compiler/data_models/MNumber";
import {getResult} from "../testRunner";

describe('Variable assignment', () => {
    test('variable access', () => {
        let result_ = getResult("x = 3^2 + (1)");
        let executor = result_.executor;

        let found = executor.symbolTable.get("x");

        expect(found).toBeInstanceOf(MNumber);
        if (found instanceof MNumber) {
            expect(found!.matrix[0][0].real).toBe(10);
            expect(found!.matrix[0][0].imaginary).toBe(0);
        }
    });
});
