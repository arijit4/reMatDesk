import {MNumber} from "./data_models/MNumber";
import {PlusNode} from "./nodes/plus_node";
import {MinusNode} from "./nodes/minus_node";
import {DotMultiplyNode, MultiplyNode} from "./nodes/multiply_node";
import {DivisionNode, DotDivisionNode} from "./nodes/division_node";
import {DotPowerNode, PowerNode} from "./nodes/power_node";
import {MError} from "./data_models/MError";
import {MNumberBuilder} from "./data_models/MNumberBuilder";
import {MatrixRangeNode} from "./nodes/matrix_range_node";

export type ParserNode =
    MNumber
    | MNumberBuilder
    | MatrixRangeNode
    | MError
    | PowerNode
    | PlusNode
    | MinusNode
    | MultiplyNode
    | DivisionNode
    | DotPowerNode
    | DotMultiplyNode
    | DotDivisionNode;

export type PowerFactorType =
    MError
    | MNumberBuilder
    | MatrixRangeNode
    | MNumber
    | PowerNode
    | DotPowerNode

export type FactorType =
    MError
    | MNumberBuilder
    | MatrixRangeNode
    | MNumber
    | PowerNode
    | MultiplyNode
    | DivisionNode
    | DotPowerNode
    | DotMultiplyNode
    | DotDivisionNode;

export type TermType =
    MError
    | MNumber
    | MNumberBuilder
    | MatrixRangeNode
    | PowerNode
    | PlusNode
    | MinusNode
    | MultiplyNode
    | DivisionNode
    | DotPowerNode
    | DotMultiplyNode
    | DotDivisionNode;
