import {ParserNode} from "../centralTypes";
import {MError} from "../data_models/MError";

export class Executor {
    execute(node: ParserNode) {
        if (node instanceof MError) {
            return node;
        }
        let mini_executor = new Executor();
        return node.execute(mini_executor);
    }
}