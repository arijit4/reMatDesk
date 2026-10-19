import {ParserNode} from "../centralTypes";
import {MNumber} from "../data_models/MNumber";
import {MError} from "../data_models/MError";

export class PowerNode {
    left: ParserNode;
    right: ParserNode;

    constructor(
        left: ParserNode,
        right: ParserNode
    ) {
        this.left = left;
        this.right = right;
    }

    execute(): MNumber | MError {
        let l = this.left instanceof MNumber ? this.left : this.left.execute();
        if (l instanceof MError) {
            return l
        }
        let r = this.right instanceof MNumber ? this.right : this.right.execute();
        if (r instanceof MError) {
            return r
        }

        if (l.isScalar() || r.isScalar()) {
            return l.scalarPower(r);
        }
        return new MError(
            "At least one of the operands must be a scalar for power operation.",
            null
        );
    }
}

export class DotPowerNode {
    left: ParserNode;
    right: ParserNode;

    constructor(
        left: ParserNode,
        right: ParserNode
    ) {
        this.left = left;
        this.right = right;
    }

    execute(): MNumber | MError {
        let l = this.left instanceof MNumber ? this.left : this.left.execute();
        if (l instanceof MError) {
            return l
        }
        let r = this.right instanceof MNumber ? this.right : this.right.execute();
        if (r instanceof MError) {
            return r
        }
        return l.dotToThePowerOf(r);
    }
}