// 10 unique pieces, some of which differ when flipped (chirality)
// and rotated (usually 4 shapes, but tetra I only has 2)

import { Point, Shape, VisualShape } from "./geometry.js";
import { convert_to_shape, convert_to_strings, convert_to_points } from "./stringify.js";
import { create_solver, PointInspector, Setter, Solver } from "./solver.js";

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
    "MMMMMM",
    "MMMMMM",
    "DDDDDDD",
    "DDDDDDD",
    "DDDDDDD",
    "DDDDDDD",
    "DDDWWWW",
    "    WWW"
];

const months = {
    Jan: { x: 0, y: 0},
    Feb: { x: 1, y: 0},
    Mar: { x: 2, y: 0},
    Apr: { x: 3, y: 0},
    May: { x: 4, y: 0},
    Jun: { x: 5, y: 0},
    Jul: { x: 0, y: 1},
    Aug: { x: 1, y: 1},
    Sep: { x: 2, y: 1},
    Oct: { x: 3, y: 1},
    Nov: { x: 4, y: 1},
    Dec: { x: 5, y: 1}
};

const days = {
    1: { x: 0, y: 2 },
    2: { x: 1, y: 2 },
    3: { x: 2, y: 2 },
    4: { x: 3, y: 2 },
    5: { x: 4, y: 2 },
    6: { x: 5, y: 2 },
    7: { x: 6, y: 2 },
    8: { x: 0, y: 3 },
    9: { x: 1, y: 3 },
    10: { x: 2, y: 3 },
    11: { x: 3, y: 3 },
    12: { x: 4, y: 3 },
    13: { x: 5, y: 3 },
    14: { x: 6, y: 3 },
    15: { x: 0, y: 4 },
    16: { x: 1, y: 4 },
    17: { x: 2, y: 4 },
    18: { x: 3, y: 4 },
    19: { x: 4, y: 4 },
    20: { x: 5, y: 4 },
    21: { x: 6, y: 4 },
    22: { x: 0, y: 5 },
    23: { x: 1, y: 5 },
    24: { x: 2, y: 5 },
    25: { x: 3, y: 5 },
    26: { x: 4, y: 5 },
    27: { x: 5, y: 5 },
    28: { x: 6, y: 5 },
    29: { x: 0, y: 6 },
    30: { x: 1, y: 6 },
    31: { x: 2, y: 6 }
};

const weekdays = {
    Sun: { x: 3, y: 6},
    Mon: { x: 4, y: 6},
    Tue: { x: 5, y: 6},
    Wed: { x: 6, y: 6},
    Thu: { x: 4, y: 7},
    Fri: { x: 5, y: 7},
    Sat: { x: 6, y: 7}
};

// where M is month, D is a day (number),
// W is a day of the week, and " " is obstructed
// returns count of ways a piece can be placed
//
// a solution leaves one M, D, and W exposed but
// covers all other positions with blocks

const shapes = vshapes.map(convert_to_shape);
const board_points = convert_to_points(vboard);

const start = performance.now();

function logBoard(pi:PointInspector) {
    console.log(convert_to_strings(board_points, (p) => pi(p) || " ").join('\n'));
}

const verbose = false;
let counter = 0;

const solver:Solver = create_solver(board_points, shapes, (set:Setter, pi:PointInspector) => {
    set(months.Mar, "M");
    set(days[3], "D");
    set(weekdays.Sun, "W");

    console.log("Solving for:");
    logBoard(pi);
});

solver((pi:PointInspector) => {
    console.log("solution:");
    logBoard(pi);
    console.log("elapsed time: " + ((performance.now() - start) / 1000));

    // return false; // do not stop, keep finding more solutions
    return true; // stop at the first solution
}, (pi:PointInspector, s:Shape) => {
    if (verbose) {
        console.log("failed to place: ");
        console.log(convert_to_strings(s.points, (p) => "O").join('\n'));
        console.log("into");
        logBoard(pi);
        console.log("--------")
    }
    counter++;

    if (counter % 1e4 === 0) {
        console.log(counter / 1e4);
    }

    return false; // always continue
});

//# sourceMappingURL=main.js.map
