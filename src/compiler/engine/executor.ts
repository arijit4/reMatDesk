import {ParserNode} from "../centralTypes";

export class Executor {
    execute(node: ParserNode) {
        return node.execute();
    }
}