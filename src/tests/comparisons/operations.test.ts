import {MNumber} from "../../compiler/data_models/MNumber";
import {getResult} from "../testRunner";

describe('Equality operations', () => {
    // equality testing
    test('True comparison', () => {
        let result = getResult("3^3 == 27").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('True comparison with matrix', () => {
        let result = getResult("[1 3; 2 4] == [ 1 2; 3 4]").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBeCloseTo(1);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBeCloseTo(0);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBeCloseTo(0);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBeCloseTo(1);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('False comparison', () => {
        let result = getResult("3^3 == 28").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("1 - pi == (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("(1 - pi) == (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});

describe('Inequality operations', () => {
    // equality testing
    test('True comparison', () => {
        let result = getResult("3^3 ~= 27").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('True comparison with matrix', () => {
        let result = getResult("[1 3; 2 4] ~= [ 1 2; 3 4]").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBeCloseTo(1);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBeCloseTo(1);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBeCloseTo(0);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('False comparison', () => {
        let result = getResult("3^3 ~= 28").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("1 - pi ~= (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("(1 - pi) ~= (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});

describe('Less than operations', () => {
    // equality testing
    test('True comparison', () => {
        let result = getResult("3^3 < 28").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('True comparison with matrix', () => {
        let result = getResult("[1 3; 2 4] < [ 1 2; 3 4]").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBeCloseTo(0);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBeCloseTo(1);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBeCloseTo(0);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('False comparison', () => {
        let result = getResult("3^3 < 28").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("1 - pi < (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("(1 - pi) < (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});

describe('Less than or equal operations', () => {
    // equality testing
    test('True comparison', () => {
        let result = getResult("3^3 == 27").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('True comparison with matrix', () => {
        let result = getResult("[1 3; 2 4] == [ 1 2; 3 4]").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBeCloseTo(1);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBeCloseTo(0);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBeCloseTo(0);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBeCloseTo(1);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('False comparison', () => {
        let result = getResult("3^3 == 28").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("1 - pi == (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("(1 - pi) == (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});

describe('Greater than operations', () => {
    // equality testing
    test('True comparison', () => {
        let result = getResult("3^3 > 27").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('True comparison with matrix', () => {
        let result = getResult("[1 3; 2 4] > [ 1 2; 3 4]").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBeCloseTo(1);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBeCloseTo(0);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBeCloseTo(0);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('False comparison', () => {
        let result = getResult("3^3 > 28").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("1 - pi > (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe( 0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("(1 - pi) > (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBe(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});

describe('Greater than or equal operations', () => {
    // equality testing
    test('True comparison', () => {
        let result = getResult("3^3 >= 27").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('True comparison with matrix', () => {
        let result = getResult("[1 3; 2 4] >= [ 1 2; 3 4]").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.dimensions.row).toBe(2);
            expect(result.dimensions.column).toBe(2);

            expect(result.matrix[0][0].real).toBeCloseTo(1);
            expect(result.matrix[0][0].imaginary).toBe(0);

            expect(result.matrix[0][1].real).toBeCloseTo(1);
            expect(result.matrix[0][1].imaginary).toBe(0);

            expect(result.matrix[1][0].real).toBeCloseTo(0);
            expect(result.matrix[1][0].imaginary).toBe(0);

            expect(result.matrix[1][1].real).toBeCloseTo(1);
            expect(result.matrix[1][1].imaginary).toBe(0);
        }
    });
    test('False comparison', () => {
        let result = getResult("3^3 >= 28").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("1 - pi >= (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("(1 - pi) >= (-pi) + 1").result
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});
