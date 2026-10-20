import {Lexer} from "./compiler/engine/lexer";
import {Parser} from "./compiler/engine/parser";
import {Executor} from "./compiler/engine/executor";
import {MError} from "./compiler/data_models/MError";
import {MNumberBuilder} from "./compiler/data_models/MNumberBuilder";

let input = "[2+2i 3; 4 5] .* [2 3; 4 5]";


let lexer = new Lexer(input);

let tokens = lexer.tokenize();
// console.log(tokens);
if (tokens instanceof MError) {
    console.log("========== Lexer Error =========");
    console.log(tokens.toString());
    process.exit(1);
} else {
    let parser = new Parser(tokens);

    let executor = new Executor();

    let x = parser.term();
    // console.log(JSON.stringify(x, null, 2));
    let result = executor.execute(x);
    if (result instanceof MError) {
        console.log("========== Executor Error =========");
        console.log(result.stringify());
    } else if (result instanceof MNumberBuilder) {
        console.log(result.toString());
    } else {
        result.print();
    }
}