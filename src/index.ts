import {Lexer} from "./compiler/engine/lexer";
import {Parser} from "./compiler/engine/parser";
import {Executor} from "./compiler/engine/executor";

function print_obj(obj: any) {
    console.log(JSON.stringify(obj, null, 2));
}


let input = "2 + (4 .* 6)";


let lexer = new Lexer(input);

let tokens = lexer.tokenize();
// console.log(tokens);
let parser = new Parser(tokens);

let executor = new Executor();
let x = parser.term();
if (x === null) {
    throw new Error("There was an error in the statement.");
}
let result = executor.execute(x);
result.print();
