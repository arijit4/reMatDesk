import {FactorType} from "../../centralTypes";
import {IfElseNode} from "../condtions/if_else_node";
import {Executor} from "../../engine/executor";
import {MError} from "../../data_models/MError";

export class PrintableNode {
    constructor(
        public node: FactorType | IfElseNode) {
    }

    execute(e: Executor) {
        if (this.node instanceof IfElseNode) {
            return this.node.execute(e);
        } else {
            let result = this.node.execute(e);
            if (result instanceof MError) {
                e.appendOutput(result.stringify(e.input));
            } else {
                e.appendOutput(result.print());
            }
        }
    }
}