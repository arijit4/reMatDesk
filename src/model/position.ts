export class Position {
    line: number;
    posStart: number;
    posEnd: number;

    constructor(line: number, start: number) {
        this.line = line;
        this.posStart = start;
        this.posEnd = start;
    }

    addToPosition() {
        this.posEnd++;
    }
}