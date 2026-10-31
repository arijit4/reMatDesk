import {ParserNode} from "../../centralTypes";
import {Executor} from "../../engine/executor";
import {MError} from "../../data_models/MError";
import {MNumber} from "../../data_models/MNumber";
import {PrintableNode} from "../utility/printable_node";
import {VarAssignmentNode} from "../variables/var_assignment_node";

export class ForLoopNode {
    index_node: ParserNode;
    body: ParserNode[];

    constructor(
        index_node: ParserNode,
        body: ParserNode[] = []
    ) {
        this.index_node = index_node;
        this.body = body;
    }

    addBodyStatement(statement: ParserNode) {
        this.body.push(statement);
    }

    execute(e: Executor): MError | MNumber {
        if (this.index_node instanceof PrintableNode) {
            this.index_node = this.index_node.node;
        }
        if (!(this.index_node instanceof VarAssignmentNode)) {
            return new MError(
                "For loop index must be a variable assignment.",
            );
        }
        let v_name = this.index_node.name;
        let v_value = this.index_node.value;

        let index = e.execute(v_value);
        if (index instanceof MError) {
            return index;
        }
        for (let j = 0; j < index.matrix[0].length; j++) {
            for (let i = 0; i < index.matrix.length; i++) {
                let tmp = (new VarAssignmentNode(v_name, index.matrix[i][j].toMNumber(), null)).execute(e);
                if (tmp instanceof MError) {
                    return tmp;
                }

                for (let statement of this.body) {
                    let result = e.execute(statement);
                    if (result instanceof MError) {
                        return result;
                    }
                }
            }
        }
        let tmp = this.index_node.execute(e);
        if (tmp instanceof MError) {
            return tmp;
        }
        return MNumber.True();
    }
}