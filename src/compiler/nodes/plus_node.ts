import {MNumber} from "../data_models/MNumber";
import {ParserNode} from "../centralTypes";

export class PlusNode {
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
        return l.add(r);
    }

    print() {
        this.left.print();
        console.log("+");
        this.right.print();
    }
}