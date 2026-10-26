import {MNumber} from "../../data_models/MNumber";
import {ParserNode} from "../../centralTypes";
import {MError} from "../../data_models/MError";
import {Executor} from "../../engine/executor";

export class MultiplyNode {
    left: ParserNode;
    right: ParserNode;

    constructor(
        left: ParserNode,
        right: ParserNode
    ) {
        this.left = left;
        this.right = right;
    }

    execute(e: Executor): MNumber | MError {
        let l = this.left instanceof MNumber ? this.left : this.left.execute(e);
        if (l instanceof MError) { return l }
        let r = this.right instanceof MNumber ? this.right : this.right.execute(e);
        if (r instanceof MError) { return r }
        return l.multiply(r);
    }
}

export class DotMultiplyNode {
    left: ParserNode;
    right: ParserNode;

    constructor(
        left: ParserNode,
        right: ParserNode
    ) {
        this.left = left;
        this.right = right;
    }

    execute(e: Executor): MNumber | MError {
        let l = this.left instanceof MNumber ? this.left : this.left.execute(e);
        if (l instanceof MError) { return l }
        let r = this.right instanceof MNumber ? this.right : this.right.execute(e);
        if (r instanceof MError) { return r }
        return l.dotMultiply(r);
    }
}