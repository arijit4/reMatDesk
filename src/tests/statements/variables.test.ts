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
    let x = parser.term(false);

    let syntaxTable = new SyntaxTable();
    let executor = new Executor(syntaxTable);
    return executor.execute(x!);
}

describe('Variable operations', () => {
    test('variable access', () => {
        let result = getResult("pi + 1");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(Math.PI + 1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('no closing bracket', () => {
        let result = getResult("2 + (3");
        expect(result).toBeInstanceOf(MError);
    });
    test('unexpected character', () => {
        let result = getResult("4 @ 5");
        expect(result).toBeInstanceOf(MError);
    });
    test('incomplete matrix', () => {
        let result = getResult("[2, 3");
        expect(result).toBeInstanceOf(MError);
    });
    test('more than 2 colons', () => {
        let result = getResult("2:4:10:15");
        expect(result).toBeInstanceOf(MError);
    });
    test('incomplete range [a:]', () => {
        let result = getResult("2:");
        expect(result).toBeInstanceOf(MError);
    });
    test('incomplete range [a:b:]', () => {
        let result = getResult("2:4:");
        expect(result).toBeInstanceOf(MError);
    });
});
