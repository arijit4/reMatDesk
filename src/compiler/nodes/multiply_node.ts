import {MNumber} from "../data_models/MNumber";
import {MAtom} from "../data_models/MAtom";
import {ParserNode} from "../centralTypes";

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

    execute() {
        return new MNumber(
            new MAtom(1)
        )
    }

    print() {
        this.left.print();
        console.log("*");
        this.right.print();
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

    execute() {
        let l: MNumber = this.left instanceof MNumber ? this.left : this.left.execute();
        let r: MNumber = this.right instanceof MNumber ? this.right : this.right.execute();
        return l.dotMultiply(r);
    }

    print() {
        this.left.print();
        console.log(".*");
        this.right.print();
    }
}