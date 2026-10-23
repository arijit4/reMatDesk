import {ParserNode} from "../centralTypes";
import {MError} from "../data_models/MError";
import {SyntaxTable} from "../../model/syntax_table";

export class Executor {
    public syntaxTable: SyntaxTable;

    constructor(syntax_table: SyntaxTable) {
        this.syntaxTable = syntax_table;
    }

    execute(node: ParserNode) {
        if (node instanceof MError) {
            return node;
        }
        let mini_executor = new Executor(this.syntaxTable);
        return node.execute(mini_executor);
    }
}