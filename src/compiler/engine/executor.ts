import {ParserNode} from "../centralTypes";
import {MError} from "../data_models/MError";
import {SymbolTable} from "../../model/symbol_table";

export class Executor {
    public symbolTable: SymbolTable;
    public input: string = "";
    public output: string = "";

    constructor(input: string, symbolTable: SymbolTable) {
        this.symbolTable = symbolTable;
    }

    execute(node: ParserNode) {
        if (node instanceof MError) {
            return node;
        }
        let mini_executor = new Executor(this.input, this.symbolTable);
        return node.execute(mini_executor);
    }

    appendOutput(str: string) {
        this.output += "\n";
        this.output += str;
    }
}