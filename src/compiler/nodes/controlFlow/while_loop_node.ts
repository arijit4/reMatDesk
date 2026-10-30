import {ParserNode} from "../../centralTypes";
import {Executor} from "../../engine/executor";
import {MError} from "../../data_models/MError";
import {MNumber} from "../../data_models/MNumber";

export class WhileLoopNode {
    condition: ParserNode;
    body: ParserNode[];

    constructor(
        condition: ParserNode,
        body: ParserNode[] = []
    ) {
        this.condition = condition;
        this.body = body;
    }

    addBodyStatement(statement: ParserNode) {
        this.body.push(statement);
    }

    execute(e: Executor): MError | MNumber {
        let conditionResult = e.execute(this.condition);
        if (conditionResult instanceof MError) {
            return conditionResult;
        }

        while (conditionResult.isTrue()) {
            for (let statement of this.body) {
                let result = e.execute(statement);
                if (result instanceof MError) {
                    return result;
                }
            }
            conditionResult = e.execute(this.condition);
            if (conditionResult instanceof MError) {
                return conditionResult;
            }
        }
        return MNumber.True();
    }
}