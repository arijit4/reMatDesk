import {Lexer} from "../../compiler/engine/lexer";
import {MError} from "../../compiler/data_models/MError";
import {Parser} from "../../compiler/engine/parser";
import {Executor} from "../../compiler/engine/executor";
import {SyntaxTable} from "../../model/syntax_table";

function getResult(input: string) {
    let lexer = new Lexer(input);
    let tokens = lexer.tokenize();
    if (tokens instanceof MError) {
        return tokens;
    }
    let parser = new Parser(tokens);
    // let x = parser.term(false);
    let x = parser.comparison(false);

    let syntaxTable = new SyntaxTable();
    let executor = new Executor(syntaxTable);
    return executor.execute(x!);
}

describe('Scalar arithmetics errors', () => {
    test('no number after an operand', () => {
        let result = getResult("2 + ");
        expect(result).toBeInstanceOf(MError);
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
