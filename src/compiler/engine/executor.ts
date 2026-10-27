import {ParserNode} from "../centralTypes";
import {MError} from "../data_models/MError";
import {SymbolTable} from "../../model/symbol_table";

export class Executor {
    public symbolTable: SymbolTable;

    constructor(symbolTable: SymbolTable) {
        this.symbolTable = symbolTable;
    }

    execute(node: ParserNode) {
        if (node instanceof MError) {
            return node;
        }
        let mini_executor = new Executor(this.symbolTable);
        return node.execute(mini_executor);
    }
}