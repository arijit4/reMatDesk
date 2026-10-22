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

    public stringify(input: string | null = null): string {
        if (input === null) {
            if (this.position) {
                return `${this.message}
            Error at line ${this.position.line}, column ${this.position.posStart}: ${this.message}`;
            } else {
                return `Error: ${this.message}`;
            }
        } else {
            if (this.position) {
                let lines = input.split("\n");
                let errorLine = lines[this.position.line - 1];
                let pointerLine = " ".repeat(this.position.posStart)
                    + "^".repeat(
                        this.position.posEnd - this.position.posStart === 0 ?
                            1 : this.position.posEnd - this.position.posStart
                    );
                return `Error at line ${this.position.line}, column ${this.position.posStart}: ${this.message}
            ${errorLine}
            ${pointerLine}`;
            } else {
                return `Error: ${this.message}`;
            }
        }
    }

    public execute() {
        return this;
    }
}