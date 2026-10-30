import {FactorType} from "../../centralTypes";
import {IfElseNode} from "../controlFlow/if_else_node";
import {Executor} from "../../engine/executor";
import {MError} from "../../data_models/MError";
import {VarAssignmentNode} from "../variables/var_assignment_node";
import {WhileLoopNode} from "../controlFlow/while_loop_node";

export class PrintableNode {
    constructor(
        public node: FactorType | IfElseNode | WhileLoopNode) {
    }

    execute(e: Executor) {
        if (this.node instanceof IfElseNode
        || this.node instanceof WhileLoopNode) {
            return this.node.execute(e);
        } else {
            let var_name: string;
            if (this.node instanceof VarAssignmentNode) {
                var_name = this.node.name;
            } else {
                this.node = new VarAssignmentNode(
                    "ans",
                    this.node,
                    null
                );
                var_name = "ans";
            }
            let result = this.node.execute(e);
            if (result instanceof MError) {
                e.appendOutput(result.stringify(e.input));
            } else {
                e.appendOutput(var_name + " = \n" + result.print());
                // e.appendOutput(result.print());
            }
            return result;
        }
    }
}