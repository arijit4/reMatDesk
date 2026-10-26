import {Executor} from "../../engine/executor";
import {MNumber} from "../../data_models/MNumber";
import {MError} from "../../data_models/MError";
import {Position} from "../../../model/position";

export class VarAccessNode {
    public key: string;
    public position: Position | null;

    constructor(
        key: string,
        position: Position | null
    ) {
        this.key = key;
        this.position = position;
    }

    execute(e: Executor): MNumber | MError {
        return e.syntaxTable.get(this.key);
    }
}