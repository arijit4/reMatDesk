import {Lexer} from "../../compiler/engine/lexer";
import {MError} from "../../compiler/data_models/MError";
import {Parser} from "../../compiler/engine/parser";
import {Executor} from "../../compiler/engine/executor";
import {SymbolTable} from "../../model/symbol_table";
import {MNumber} from "../../compiler/data_models/MNumber";

function getResult(input: string) {
    let lexer = new Lexer(input);
    let tokens = lexer.tokenize();
    if (tokens instanceof MError) {
        return tokens;
    }
    let parser = new Parser(tokens);
    let x = parser.term(false);

    let syntaxTable = new SymbolTable();
    let executor = new Executor(syntaxTable);
    return executor.execute(x!);
}

describe('Variable access', () => {
    test('variable access', () => {
        let result = getResult("pi + 1");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(Math.PI + 1);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('prefix sign handling', () => {
        let result = getResult("-pi + 1");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(-Math.PI + 1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
    test('parenthesis handling', () => {
        let result = getResult("(-pi) + 1");
        expect(result).toBeInstanceOf(MNumber);
        if (result instanceof MNumber) {
            expect(result.matrix[0][0].real).toBeCloseTo(-Math.PI + 1, 6);
            expect(result.matrix[0][0].imaginary).toBe(0);
        }
    });
});
