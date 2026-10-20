import {MNumber} from "./data_models/MNumber";
import {PlusNode} from "./nodes/plus_node";
import {MinusNode} from "./nodes/minus_node";
import {DotMultiplyNode, MultiplyNode} from "./nodes/multiply_node";
import {DivisionNode, DotDivisionNode} from "./nodes/division_node";
import {DotPowerNode, PowerNode} from "./nodes/power_node";
import {MError} from "./data_models/MError";
import {MNumberBuilder} from "./data_models/MNumberBuilder";

export type ParserNode =
    MNumber
    | MNumberBuilder
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
    | MNumber
    | PowerNode
    | DotPowerNode

export type FactorType =
    MError
    | MNumberBuilder
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
    | PowerNode
    | PlusNode
    | MinusNode
    | MultiplyNode
    | DivisionNode
    | DotPowerNode
    | DotMultiplyNode
    | DotDivisionNode;
