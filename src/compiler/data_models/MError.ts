import {Position} from "../../model/position";

export class MError {
    public message: string;
    public position: Position | null = null;

    constructor(
        message: string,
        position: Position | null = null
    ) {
        this.message = message;
        this.position = position;
    }

    public toString(): string {
        if (this.position) {
            return `${this.message}
            Error at line ${this.position.line}, column ${this.position.posStart}: ${this.message}`;
        } else {
            return `Error: ${this.message}`;
        }
    }

    public execute() {
        return this;
    }
}