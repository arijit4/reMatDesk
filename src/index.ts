import {Lexer} from "./compiler/engine/lexer";
import {Parser} from "./compiler/engine/parser";
import {Executor} from "./compiler/engine/executor";
import {MError} from "./compiler/data_models/MError";
import {SymbolTable} from "./model/symbol_table";
import {MNumber} from "./compiler/data_models/MNumber";

let input =
    `if pi < 3
         x = 1
         y = 2
         
         z = x + y - pi
    `;
// input = "x = y = 2"

let lexer = new Lexer(input);

let tokens = lexer.tokenize();
// console.log(tokens);
if (tokens instanceof MError) {
    console.log("========== Lexer Error =========");
    console.log(tokens.toString());
    process.exit(1);
} else {
    let parser = new Parser(tokens);

    let symbolTable = new SymbolTable();
    let executor = new Executor(symbolTable);

    let x = parser.generateAST();
    // console.log(JSON.stringify(x, null, 2));
    let result = executor.execute(x);
    if (result instanceof MError) {
        console.log("========== Executor Error =========");
        console.log(result.stringify(input));
    } else {
        if (result instanceof MNumber) {
            result.print();
        }
        console.log(symbolTable.stringify(true));
    }
}