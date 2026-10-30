import {FactorType} from "../../centralTypes";
import {Executor} from "../../engine/executor";
import {MError} from "../../data_models/MError";
import {MNumber} from "../../data_models/MNumber";

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

    setElseBlock(block: ConditionBlock) {
        this.else_block = block;
    }

    execute(e: Executor): MNumber {
        for (let block of this.conditionBlocks) {
            let result = block.execute(e);
            if (result instanceof MError) {
                return MNumber.False();
            }

            if (result.isTrue()) {
                return MNumber.True();
            }
        }
        if (this.else_block !== null) {
            let result = this.else_block.execute(e);
            if (result instanceof MError) {
                return MNumber.False();
            }

            if (result.isTrue()) {
                return MNumber.True();
            }
        }

        return MNumber.False();
    }
}

export class ConditionBlock {
    private condition: FactorType | null; // null for else block
    private statements: (FactorType | IfElseNode)[]

    constructor(
        condition: FactorType | null = null,
        block: (FactorType | IfElseNode)[] = []
    ) {
        this.condition = condition;
        this.statements = block;
    }

    setCondition(condition: FactorType | null) {
        this.condition = condition;
    }

    addStatements(statements: FactorType | IfElseNode) {
        this.statements.push(statements);
    }

    execute(e: Executor) : MNumber | MError {
        if (this.condition === null) {
            for (let statement of this.statements) {
                let result = e.execute(statement);
                if (result instanceof MError) {
                    return result;
                }
            }
            return MNumber.True();
        }

        let conditionResult = e.execute(this.condition);
        if (conditionResult instanceof MError) {
            return MNumber.False();
        }

        if (conditionResult.isTrue()) {
            for (let statement of this.statements) {
                let result = e.execute(statement);
                if (result instanceof MError) {
                    return result;
                }
            }
            return MNumber.True();
        }
        return MNumber.False();
    }
}