import {MNumber} from "./data_models/MNumber";
import {PlusNode} from "./nodes/arithmetics/plus_node";
import {MinusNode} from "./nodes/arithmetics/minus_node";
import {DotMultiplyNode, MultiplyNode} from "./nodes/arithmetics/multiply_node";
import {DivisionNode, DotDivisionNode} from "./nodes/arithmetics/division_node";
import {DotPowerNode, PowerNode} from "./nodes/arithmetics/power_node";
import {MError} from "./data_models/MError";
import {MNumberBuilder} from "./data_models/MNumberBuilder";
import {MatrixRangeNode} from "./nodes/arithmetics/matrix_range_node";
import {VarAccessNode} from "./nodes/variables/var_access_node";
import {VarAssignmentNode} from "./nodes/variables/var_assignment_node";

export type ParserNode =
    MNumber
    | MNumberBuilder
    | MatrixRangeNode
    | VarAccessNode
    | VarAssignmentNode
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
    | VarAccessNode
    | VarAssignmentNode
    | MNumberBuilder
    | MatrixRangeNode
    | MNumber
    | PowerNode
    | DotPowerNode

export type FactorType =
    MError
    | MNumberBuilder
    | MatrixRangeNode
    | VarAccessNode
    | VarAssignmentNode
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
    | VarAccessNode
    | VarAssignmentNode
    | MatrixRangeNode
    | PowerNode
    | PlusNode
    | MinusNode
    | MultiplyNode
    | DivisionNode
    | DotPowerNode
    | DotMultiplyNode
    | DotDivisionNode;
