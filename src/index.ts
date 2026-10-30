import {Lexer} from "./compiler/engine/lexer";
import {Parser} from "./compiler/engine/parser";
import {Executor} from "./compiler/engine/executor";
import {MError} from "./compiler/data_models/MError";
import {SymbolTable} from "./model/symbol_table";
import {MNumber} from "./compiler/data_models/MNumber";
import {readFileSync} from "fs";

let input = readFileSync("../reMatDesk/src/input.m", "utf8")
    .replace(/\r\n?/g, '\n');


let lexer = new Lexer(input);

let tokens = lexer.tokenize();
// console.log(tokens);
if (tokens instanceof MError) {
    console.log("========== Lexer Error =========");
    console.log(tokens.stringify(input));
    process.exit(1);
} else {
    let parser = new Parser(tokens);

    let symbolTable = new SymbolTable();
    let executor = new Executor(input, symbolTable);

    let x = parser.generateAST();
    // console.log(JSON.stringify(x, null, 2));
    let result = executor.execute(x);
    if (result instanceof MError) {
        console.log("========== Executor Error =========");
        console.log(result.stringify(input));
    } else {
        if (result instanceof MNumber) {
            console.log(result.print());
        }
        console.log(symbolTable.stringify(true));
    }
    console.log("========== Output =========");
    console.log(executor.output);
}