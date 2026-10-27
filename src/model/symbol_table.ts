import {MError} from "../compiler/data_models/MError";
import {MNumber} from "../compiler/data_models/MNumber";
import {MAtom} from "../compiler/data_models/MAtom";

export class SymbolTable {
    public dictionary: Record<string, MNumber>;

    constructor() {
        this.dictionary = {};

        this.add("pi", new MNumber(new MAtom(Math.PI, 0, null, true)));
        this.add("e", new MNumber(new MAtom(Math.exp(1), 0, null, true)));

        this.add("true", new MNumber(new MAtom(1, 0, null, true)));
        this.add("false", new MNumber(new MAtom(0, 0, null, true)));
    }

    add(key: string, value: MNumber) {
        this.dictionary[key] = value;
    }

    get(key: string): MNumber | MError {
        let r = this.dictionary[key];
        if (r === undefined) {
            return new MError(
                `Identifier "${key}" is not defined.`
            );
        }
        return r;
    }

    has(key: string) {
        return this.dictionary[key] !== undefined;
    }

    stringify(includeDefaults: boolean = false): string {
        let temp = this.dictionary
        let result = "========== Syntax Table =========\n";
        for (let [key, value] of Object.entries(temp)) {
            if (includeDefaults && value.matrix[0][0].isDefault) {
                result += `${key} = ${value.matrix[0][0].real} + ${value.matrix[0][0].imaginary}i`;
                result += " \t\t(default value)\n";
            }
            if (!value.matrix[0][0].isDefault) {
                result += `${key} = ${value.matrix[0][0].real} + ${value.matrix[0][0].imaginary}i`;
                result += " \n";
            }
        }
        return result;
    }
}