import {Position} from "./position";

export class Token {
    type: string;
    value: string;
    position: Position | null;

    constructor(
        type: string,
        value: string,
        position: Position | null = null
    ) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
}