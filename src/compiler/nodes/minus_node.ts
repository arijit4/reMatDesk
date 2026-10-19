import {MNumber} from "../data_models/MNumber";
import {ParserNode} from "../centralTypes";
import {MError} from "../data_models/MError";

export class MinusNode {
    left: ParserNode;
    right: ParserNode;

    constructor(
        left: ParserNode,
        right: ParserNode,
    ) {
        this.left = left;
        this.right = right;
    }

    execute(): MNumber | MError {
        let l = this.left instanceof MNumber ? this.left : this.left.execute();
        if (l instanceof MError) { return l }
        let r = this.right instanceof MNumber ? this.right : this.right.execute();
        if (r instanceof MError) { return r }
        return l.subtract(r);
    }
}

