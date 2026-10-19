import {Lexer} from "./compiler/engine/lexer";
import {Parser} from "./compiler/engine/parser";
import {Executor} from "./compiler/engine/executor";
import {MError} from "./compiler/data_models/MError";

let input = "2 ./ 0";


let lexer = new Lexer(input);

let tokens = lexer.tokenize();
// console.log(tokens);
if (tokens instanceof MError) {
    console.log(tokens.toString());
    process.exit(1);
} else {
    let parser = new Parser(tokens);

    let executor = new Executor();
    let x = parser.term();
    let result = executor.execute(x);
    if (result instanceof MError) {
        console.log(x.toString())
    } else {
        result.print();
    }
}