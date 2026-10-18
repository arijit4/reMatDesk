import {Lexer} from "./compiler/engine/lexer";
import {Parser} from "./compiler/engine/parser";
import {Executor} from "./compiler/engine/executor";

function print_obj(obj: any) {
    console.log(JSON.stringify(obj, null, 2));
}


let input = "2^0.5^2^3 + 1";


let lexer = new Lexer(input);

let tokens = lexer.tokenize();
// console.log(tokens);
let parser = new Parser(tokens);

let executor = new Executor();
let x = parser.term();

let result = executor.execute(x);
result.print();
