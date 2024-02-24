// 10 unique pieces, some of which differ when flipped (chirality)
// and rotated (usually 4 shapes, but tetra I only has 2)

import { Point, Shape, VisualShape } from "./types";
import { Board } from "./board"
import { convert_to_shape, convert_to_strings, convert_to_points } from "./stringify";
import { create_solver, Solver } from "./solver";

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

function logBoard(board:Board) {
    console.log(convert_to_strings(board_points, (p) => board.at(p) || " ").join('\n'));
}

const verbose = false;

const solver:Solver = create_solver(board_points, shapes, (board) => {
    board.fill([{x: 1, y: 0}], "M"); // Feb
    board.fill([{x: 3, y: 5}], "D"); // 25
    board.fill([{x: 3, y: 6}], "W"); // Sun

    console.log("Solving for:");
    logBoard(board);
});

solver((board) => {
    console.log("solution:");
    logBoard(board);
    console.log("elapsed time: " + ((performance.now() - start) / 1000));

    // return false; // do not stop, keep finding more solutions
    return true; // stop at the first solution
}, (board, s) => {
    if (verbose) {
        console.log("failed to place: ");
        console.log(convert_to_strings(s.points, (p) => "O").join('\n'));
        console.log("into");
        logBoard(board);
        console.log("--------")
    }
    return false; // always continue
});

/*
// dump all shape variations visually
for (let shape of shapes) {
    const vs = variants(shape, {x: 0, y: 0});
    const vs_as_strings = vs.map((v) => convert_to_strings(v, (_) => "o"));
    console.log(vs_as_strings.map((sa) => sa.join("\n")).join("\n\n"));
    console.log("\n-----\n");
}

// dump the board back out
console.log(convert_to_strings(board_points, (_) => "o").join('\n'));
*/

//# sourceMappingURL=main.js.map
