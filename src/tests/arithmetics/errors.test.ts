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
    let x = parser.term();

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
    test('matrix build without comma', () => {
        let result = getResult("[1+3i -3.123; 4+2 5]");
        expect(result).toBeInstanceOf(MError);
        /*
        * in my compiler, the first row is
        * read as (1 + 3i - 3.123)
        * making it only 1 integer. so the matrix becomes:
        * [-2.123 + 3i]
        * [     6      5]
        * which is not a valid matrix, so it should return an error
        *
        * but in the MatLab, the first row is read as (1 + 3i) and (-3.123)
        * so, this here is a limitation of my compiler.
        *
        * This can be fixed by lexing SPACES and using ignoreSpace() in the parser
        * when needed.
        */
    });

});
