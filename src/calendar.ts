import { LabeledPoints, Point, Shape, VisualShape } from "./geometry.js";
import { convert_to_shape, convert_to_strings, convert_to_labeled_points } from "./stringify.js";

const vshapes: VisualShape[] = [
    {   // tetra I
        chiral: false,
        rotations: 1,
        points: [   
        "OOOO"
        ]
    },
    {   // tetra L/J
        chiral: true,
        rotations: 3,
        points: [
        "OOO",
        "O"
    ]},
    {   // tetra S/Z
        chiral: true,
        rotations: 1,
        points: [   
        "OO",
        " OO"
    ]},
    {   // penta L/Q
        chiral: true,
        rotations: 3,
        points: [
        "OOOO",
        "O"
    ]},
    {   // penta N/S
        chiral: true,
        rotations: 3,
        points: [
        "OOO",
        "  OO"
    ]},
    {   // penta U
        chiral: false,
        rotations: 3,
        points: [
        "OOO",
        "O O"
    ]},
    {   // penta T
        chiral: false,
        rotations: 3,
        points: [
        "OOO",
        " O",
        " O"
    ]},
    {   // penta P
        chiral: true,
        rotations: 3,
        points: [
        "OOO",
        "OO"
    ]},
    {   // penta V
        chiral: false,
        rotations: 3,
        points: [
        "OOO",
        "O",
        "O"
    ]},
    {   // penta Z
        chiral: true,
        rotations: 1,
        points: [
        "OO",
        " O",
        " OO"
    ]},
];

// Board is shaped like this:
const vboard: string[] = [
    "Jan Feb Mar Apr May Jun",
    "Jul Aug Sep Oct Nov Dec",
    "  1   2   3   4   5   6   7",
    "  8   9  10  11  12  13  14",
    " 15  16  17  18  19  20  21",
    " 22  23  24  25  26  27  28",
    " 29  30  31 Sun Mon Tue Wed",
    "                Thu Fri Sat"
];

const shapes = vshapes.map(convert_to_shape);
const labels = convert_to_labeled_points(vboard, 4);
const board = labels.map(e => e.point);

const calendarDefinitions = {
    shapes,
    labels,
    board
};

export function definitions() {
    return calendarDefinitions
};