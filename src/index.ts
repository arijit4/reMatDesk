import {Lexer} from "./compiler/engine/lexer";
import {Parser} from "./compiler/engine/parser";
import {Executor} from "./compiler/engine/executor";
import {MError} from "./compiler/data_models/MError";
import {MNumberBuilder} from "./compiler/data_models/MNumberBuilder";

let input = "2^2^2 * 3^3^3 +( 207 + (40000+ (2*100000 + 10^7*4) + 4*10^8 + 87799*10^10) + 1)";
// let input = "2^2^2*0 + 27^3 ";

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

    let x = parser.term(false);
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