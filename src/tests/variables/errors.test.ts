import {Lexer} from "../../compiler/engine/lexer";
import {MError} from "../../compiler/data_models/MError";
import {Parser} from "../../compiler/engine/parser";
import {Executor} from "../../compiler/engine/executor";
import {SymbolTable} from "../../model/symbol_table";

function getResult(input: string) {
    let lexer = new Lexer(input);
    let tokens = lexer.tokenize();
    if (tokens instanceof MError) {
        return tokens;
    }
    let parser = new Parser(tokens);
    let x = parser.term(false);

    let syntaxTable = new SymbolTable();
    let executor = new Executor(syntaxTable);
    return executor.execute(x!);
}

describe('Scalar arithmetics errors', () => {
    test('identifier not defined', () => {
        let result = getResult("x + y");
        expect(result).toBeInstanceOf(MError);
    });
});
