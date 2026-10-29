export const isKeyword = (value: string): boolean => {
    return [
        'if',
        'elseif',
        'else',
        'end'
    ].includes(value);
}
