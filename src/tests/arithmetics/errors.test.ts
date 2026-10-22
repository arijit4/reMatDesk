import {Lexer} from "../../compiler/engine/lexer";
import {MError} from "../../compiler/data_models/MError";
import {Parser} from "../../compiler/engine/parser";
import {Executor} from "../../compiler/engine/executor";

function getResult(input: string) {
    let lexer = new Lexer(input);
    let tokens = lexer.tokenize();
    if (tokens instanceof MError) {
        return tokens;
    }
    let parser = new Parser(tokens);
    let x = parser.term(false);

    let executor = new Executor();
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
});
