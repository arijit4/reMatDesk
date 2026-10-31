import {TermType} from "../../centralTypes";
import {Position} from "../../../model/position";
import {Executor} from "../../engine/executor";
import {MError} from "../../data_models/MError";
import {MNumber} from "../../data_models/MNumber";

export class VarAssignmentNode {
    name: string;
    value: TermType;
    private position: Position | null;

    constructor(
        name: string,
        value: TermType,
        position: Position | null
    ) {
        this.name = name;
        this.value = value;
        this.position = position;
    }

    execute(e: Executor): MNumber | MError {
        let result = this.value.execute(e);
        if (result instanceof MError) {
            return result;
        }
        e.symbolTable.add(this.name, result);
        return result;
    }
}