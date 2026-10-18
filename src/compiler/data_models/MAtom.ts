// import {Token} from "./model/token";
import {Position} from "../../model/position";

export class MAtom {
    public real: number;
    public imaginary: number = 0;
    public pos: Position | null = null;

    public isDefault: boolean = false;

    constructor(
        real: number,
        imaginary: number = 0,
        pos: Position | null = null,
        isDefault: boolean = false
    ) {
        let zero = 0; // -0 and 0 are different in js -_-

        this.real = real + zero;
        this.imaginary = imaginary + zero;
        this.pos = pos;

        this.isDefault = isDefault;
    }

    add(n: MAtom) {
        return new MAtom(
            this.real + n.real,
            this.imaginary + n.imaginary
        )
    }

    subtract(n: MAtom) {
        return new MAtom(
            this.real - n.real,
            this.imaginary - n.imaginary
        )
    }

    multiply(n: MAtom) {
        return new MAtom(
            this.real * n.real - this.imaginary * n.imaginary,
            this.real * n.imaginary + this.imaginary * n.real
        )
    }

    divide(n: MAtom) {
        let c2_d2 = n.real * n.real + n.imaginary * n.imaginary
        return new MAtom(
            (this.real * n.real + this.imaginary * n.imaginary) / c2_d2,
            (this.imaginary * n.real - this.real * n.imaginary) / c2_d2
        )
    }

    toThePowerOf(n: MAtom) {
        let a = this.real
        let b = this.imaginary

        let c = n.real
        let d = n.imaginary

        let radius = Math.sqrt(a * a + b * b)
        let theta = Math.atan2(b, a)

        let common = Math.pow(radius, c) * Math.exp(-d * theta)
        let in_sin_cos = c * theta + d * Math.log(radius)

        return new MAtom(
            common * Math.cos(in_sin_cos),
            common * Math.sin(in_sin_cos)
        )
    }

    hasImaginary() {
        return Math.abs(this.imaginary) > 1e-13;
    }

    stringify(printAsIfHasImaginary: boolean = false): string {
        let r = (+(this.real.toFixed(4)))
        let i = (+(this.imaginary.toFixed(4)))
        let ai = Math.abs(i)

        if (i === 0 && !printAsIfHasImaginary) {
            return r.toString()
        }

        let s = r.toFixed(4)

        if (i < 0) s += " - ";
        else s += " + ";

        s += ai.toFixed(4) + "i";
        return s;
    }
}