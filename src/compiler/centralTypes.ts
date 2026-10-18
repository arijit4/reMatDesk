import {MNumber} from "./data_models/MNumber";
import {PlusNode} from "./nodes/plus_node";
import {MinusNode} from "./nodes/minus_node";
import {DotMultiplyNode, MultiplyNode} from "./nodes/multiply_node";
import {DivisionNode, DotDivisionNode} from "./nodes/division_node";
import {DotPowerNode, PowerNode} from "./nodes/power_node";

export type ParserNode =
    MNumber
    | PowerNode
    | PlusNode
    | MinusNode
    | MultiplyNode
    | DivisionNode
    | DotPowerNode
    | DotMultiplyNode
    | DotDivisionNode;

export type PowerFactorType =
    boolean
    | MNumber
    | PowerNode
    | DotPowerNode

export type FactorType =
    boolean
    | MNumber
    | PowerNode
    | MultiplyNode
    | DivisionNode
    | DotPowerNode
    | DotMultiplyNode
    | DotDivisionNode;

export type TermType =
    boolean
    | MNumber
    | PowerNode
    | PlusNode
    | MinusNode
    | MultiplyNode
    | DivisionNode
    | DotPowerNode
    | DotMultiplyNode
    | DotDivisionNode;
