export const isKeyword = (value: string): boolean => {
    return [
        'if',
        'elseif',
        'else',
        'end',
        'while'
    ].includes(value);
}
