import {TermType} from "../../centralTypes";
import {Executor} from "../../engine/executor";
import {MNumber} from "../../data_models/MNumber";
import {MAtom} from "../../data_models/MAtom";
import {MError} from "../../data_models/MError";

export class MatrixRangeNode {
    public start: TermType;
    public step: TermType | null;
    public end: TermType;

    constructor(
        a: TermType,
        b: TermType,
        c: TermType | null = null
    ) {
        if (c !== null) {
            this.start = a;
            this.step = b;
            this.end = c;
        } else {
            this.start = a;
            this.end = b;
            this.step = null;
        }
    }

    execute(e: Executor): MNumber | MError {
        let s = this.step;
        if (s === null) {
            s = new MNumber(new MAtom(1));
        }
        let step = s.execute(e);
        if (step instanceof MError) {
            return step;
        }

        let start = this.start.execute(e);
        if (start instanceof MError) {
            return start;
        }

        let end = this.end.execute(e);
        if (end instanceof MError) {
            return end;
        }

        let result = new MNumber(null);

        for (let i = start.matrix[0][0].real; i <= end.matrix[0][0].real; i += step.matrix[0][0].real) {
            result.push(new MAtom(i));
        }
        return result;
    }
}