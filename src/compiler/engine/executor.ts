import {ParserNode} from "../centralTypes";
import {MError} from "../data_models/MError";

export class Executor {
    execute(node: ParserNode) {
        if (node instanceof MError) {
            return node;
        }
        return node.execute();
    }
}