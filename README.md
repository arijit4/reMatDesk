## reMatDesk

This project is intended to be a lightweight MatLab interpreter alternative for
students. The goal is to provide just as much functionality needed to have 
the basic understanding and knowledge of MatLab without the need to install
the full software. This project also reflects my personal understanding of
how an interpreter works and how to implement one.

### Stack
- __TypeScript__ for the interpreter core
- __Jest__ for testing

This interpreter is being written completely in TypeScript. The core idea behind
choosing TypeScript was mostly to understand JavaScript and TypeScript better
and to build a full native app out of it using Tauri or Electorn. And as it is
purely written in TypeScript, it can also be made to run in the browser as well.

### Current features
- Arithmetic operations
  - Operator precedence
  - Parentheses
  - Exponentiation (in MatLab way)
  - Complex numbers
  - Matrix
- Variables
  - Assignment
  - Accessing
- Comparisons
  - Equal
  - Not equal
  - Greater than
  - Less than
  - Greater than or equal to
  - Less than or equal to
- Error messages