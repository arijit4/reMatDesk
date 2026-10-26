import {Lexer} from "../../compiler/engine/lexer";
import {MError} from "../../compiler/data_models/MError";
import {Parser} from "../../compiler/engine/parser";
import {Executor} from "../../compiler/engine/executor";
import {SyntaxTable} from "../../model/syntax_table";
import {MNumber} from "../../compiler/data_models/MNumber";

function getResult(input: string) {
    let lexer = new Lexer(input);
    let tokens = lexer.tokenize();
    if (tokens instanceof MError) {
        return tokens;
    }
    let parser = new Parser(tokens);
    let x = parser.comparison(false);

    let syntaxTable = new SyntaxTable();
    let executor = new Executor(syntaxTable);
    return executor.execute(x!);
}

describe('Comparison operations', () => {
    test('True comparison', () => {
        let result = getResult("3^3 == 27");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('True comparison with matrix', () => {
        let result = getResult("[1 3; 2 4] == [ 1 2; 3 4]");
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
        let result = getResult("3^3 == 28");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(0);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("1 - pi == (-pi) + 1");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("(1 - pi) == (-pi) + 1");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});
