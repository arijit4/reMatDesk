import {KeywordType} from "../model/keywordType";

export const isKeyword = (value: string): boolean => {
    return [
        KeywordType.IF,
        KeywordType.ELSEIF,
        KeywordType.ELSE,
        KeywordType.END,
        KeywordType.WHILE,
        KeywordType.FOR
    ].includes(value);
}
