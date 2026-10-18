import {ParserNode} from "../centralTypes";
import {MNumber} from "../data_models/MNumber";
import {MAtom} from "../data_models/MAtom";

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

    execute() {
        let l: MNumber = this.left instanceof MNumber ? this.left : this.left.execute();
        let r: MNumber = this.right instanceof MNumber ? this.right : this.right.execute();

        if (l.isScalar() || r.isScalar()) {
            return l.scalarPower(r);
        }
        throw new Error("At least one of the operands must be a scalar for power operation.");
    }

    print() {
        this.left.print();
        console.log("^");
        this.right.print();
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

    execute() {
        let l: MNumber = this.left instanceof MNumber ? this.left : this.left.execute();
        let r: MNumber = this.right instanceof MNumber ? this.right : this.right.execute();
        return l.dotToThePowerOf(r);
    }

    print() {
        this.left.print();
        console.log(".^");
        this.right.print();
    }
}