export const isDigit = (char: string) => /\d/.test(char);
export const isAlpha = (char: string) => /[a-zA-Z]/.test(char);
export const isAlphaNumeric = (char: string) => /[a-zA-Z0-9]/.test(char);
export const isNewline = (char: string) => char === '\n';
export const isOperator = (char: string) => ['+', '-', '*', '/', '^'].includes(char);