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
import {IfElseNode} from "./nodes/condtions/if_else_node";
import {PrintableNode} from "./nodes/utility/printable_node";


export type FactorType =
    MError
    | MNumber
    | MNumberBuilder
    | MatrixRangeNode
    | VarAccessNode
    | VarAssignmentNode
    | PowerNode
    | DotPowerNode
    | PlusNode
    | MinusNode
    | MultiplyNode
    | DotMultiplyNode
    | DivisionNode
    | DotDivisionNode;

export type TermType = FactorType
export type PowerFactorType = FactorType

export type ParserNode =
    FactorType
    | IfElseNode
    | PrintableNode;

