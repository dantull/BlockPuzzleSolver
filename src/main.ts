// 10 unique pieces, some of which differ when flipped (chirality)
// and rotated (usually 4 shapes, but tetra I only has 2)

import { Shape, VisualShape } from "./geometry";
import { convert_to_shape, convert_to_strings, convert_to_points } from "./stringify";
import { create_solver, PointInspector, Setter, Solver } from "./solver";

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
    set({x: 1, y: 0}, "M"); // Feb
    set({x: 3, y: 5}, "D"); // 25
    set({x: 3, y: 6}, "W"); // Sun

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
