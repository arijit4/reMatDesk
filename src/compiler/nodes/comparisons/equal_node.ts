import {MNumber} from "../../data_models/MNumber";
import {TermType} from "../../centralTypes";
import {Executor} from "../../engine/executor";
import {MError} from "../../data_models/MError";

export class EqualNode {
    left: TermType;
    right: TermType;

    constructor(
        left: TermType,
        right: TermType
    ) {
        this.left = left;
        this.right = right;
    }

    execute(e: Executor) {
        let l = this.left instanceof MNumber ? this.left : this.left.execute(e);
        if (l instanceof MError) { return l; }

        let r = this.right instanceof MNumber ? this.right : this.right.execute(e);
        if (r instanceof MError) { return r; }

        return l.equals(r);
    }
}