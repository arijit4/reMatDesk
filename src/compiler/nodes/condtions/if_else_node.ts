import {FactorType} from "../../centralTypes";
import {Executor} from "../../engine/executor";
import {MError} from "../../data_models/MError";

export class IfElseNode {
    private conditionBlocks: ConditionBlock[];
    private else_block: ConditionBlock | null;

    constructor(
        conditionBlocks: ConditionBlock[] = [],
        else_block: ConditionBlock | null = null
    ) {
        this.conditionBlocks = conditionBlocks;
        this.else_block = else_block;
    }

    addConditionBlock(block: ConditionBlock) {
        this.conditionBlocks.push(block);
    }

    execute(e: Executor): boolean {
        let executionCount = 0;

        for (let block of this.conditionBlocks) {
            let result = block.execute(e);
            if (result instanceof MError) {
                return false;
            }
            if (result !== null) {
                executionCount++;
            }
        }

        return executionCount <= 1;
    }
}

export class ConditionBlock {
    private condition: FactorType;
    private statements: (FactorType | IfElseNode)[]

    constructor(
        condition: FactorType,
        block: FactorType[] = []
    ) {
        this.condition = condition;
        this.statements = block;
    }

    addStatements(statements: FactorType | IfElseNode) {
        this.statements.push(statements);
    }

    execute(e: Executor) {
        let conditionResult = e.execute(this.condition);
        if (conditionResult instanceof MError) {
            return false;
        }
        if (conditionResult === true || conditionResult === false) {
            return false;
        }

        if (conditionResult.matrix[0][0].real === 1) {
            for (let statement of this.statements) {
                let result = e.execute(statement);
                if (result instanceof MError) {
                    return result;
                }
            }
        }
        return true;
    }
}