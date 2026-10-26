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
    let x = parser.comparison(false);

    let syntaxTable = new SyntaxTable();
    let executor = new Executor(syntaxTable);
    return executor.execute(x!);
}

describe('Comparison operations', () => {
    test('Missing right operand', () => {
        let result = getResult("3^3 == ");
        expect(result).toBeInstanceOf(MError);
    });
    test('Missing left operand', () => {
        let result = getResult(" == 28");
        expect(result).toBeInstanceOf(MError);
    });
    test('comparison with matrix', () => {
        let result = getResult("[1 3; 2 4] == [ 1 2; 3]");
        expect(result).toBeInstanceOf(MError);
    });
});
