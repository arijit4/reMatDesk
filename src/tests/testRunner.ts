import {Executor} from "../compiler/engine/executor";
import {MNumber} from "../compiler/data_models/MNumber";
import {MError} from "../compiler/data_models/MError";
import {Lexer} from "../compiler/engine/lexer";
import {SymbolTable} from "../model/symbol_table";
import {Parser} from "../compiler/engine/parser";

export function getResult(input: string): { executor: Executor, result: MNumber | MError | Boolean } {
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
