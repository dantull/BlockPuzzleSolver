import { VisualShape } from "./geometry.js";
import { convert_to_shape, convert_to_labeled_points } from "./stringify.js";
import { L, N, U, T, P, V, Z } from "./pentominoes.js";

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
        ]
    },
    {   // tetra S/Z
        chiral: true,
        rotations: 1,
        points: [
            "OO",
            " OO"
        ]
    },
    L, N, U, T, P, V, Z
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