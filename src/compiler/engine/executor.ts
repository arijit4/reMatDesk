import {ParserNode} from "../centralTypes";
import {MError} from "../data_models/MError";
import {SymbolTable} from "../../model/symbol_table";
import {MNumber} from "../data_models/MNumber";

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
        let res = node.execute(mini_executor);
        this.output += mini_executor.output;
        return res;
    }

    executeInterpretableAST(node: ParserNode[]) {
        for (let i = 0; i < node.length; i++) {
            let res = this.execute(node[i]);
            if (res instanceof MError) {
                return res;
            }
        }
        return MNumber.True();
    }

    appendOutput(str: string) {
        this.output += "\n";
        this.output += str;
    }
}