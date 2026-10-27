import {Lexer} from "../../compiler/engine/lexer";
import {MError} from "../../compiler/data_models/MError";
import {Parser} from "../../compiler/engine/parser";
import {Executor} from "../../compiler/engine/executor";
import {SymbolTable} from "../../model/symbol_table";
import {MNumber} from "../../compiler/data_models/MNumber";

function getResult(input: string): { executor: Executor, result: MNumber | MError } {
    let lexer = new Lexer(input);
    let tokens = lexer.tokenize();

    let syntaxTable = new SymbolTable();
    let executor = new Executor(syntaxTable);

    if (tokens instanceof MError) {
        return {executor: executor, result: tokens};
    }
    let parser = new Parser(tokens);
    let x = parser.generateAST();

    return {executor: executor, result: executor.execute(x!)};
}

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
