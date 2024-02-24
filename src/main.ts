// 10 unique pieces, some of which differ when flipped (chirality)
// and rotated (usually 4 shapes, but tetra I only has 2)

import { Point, Shape, VisualShape } from "./types";
import { Board } from "./board"

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

function convert_to_points(shape: string[]): Point[] {
    const points = [];
    for (var y = 0; y < shape.length; y++) {
        const line = shape[y];
        for (var x = 0; x < line.length; x++) {
            if (line.charAt(x) !== " ") {
                points.push({x, y});
            }
        }
    }

    return points; 
}

function bounds(ps: Point[]): [Point, Point] {
    const minX = ps.reduce((m:number, p) => Math.min(m, p.x), Number.POSITIVE_INFINITY);
    const maxX = ps.reduce((m:number, p) => Math.max(m, p.x), Number.NEGATIVE_INFINITY);
    const minY = ps.reduce((m:number, p) => Math.min(m, p.y), Number.POSITIVE_INFINITY);
    const maxY = ps.reduce((m:number, p) => Math.max(m, p.y), Number.NEGATIVE_INFINITY);
    return [{x:minX, y:minY}, {x:maxX, y:maxY}];
}

function convert_to_strings(ps:Point[], to_char:(p:Point) => string): string[] {
    const [min, max] = bounds(ps);

    const grid:string[][] = [];
    const width = max.x - min.x + 1;
    const height = max.y - min.y + 1;
    for (let i = 0; i < height; i++) {
        grid[i] = new Array(width).fill(' ');
    }

    for (let p of ps) {
        grid[p.y - min.y][p.x - min.x] = to_char(p);
    }

    return grid.map((cs) => cs.join(""));
}

function convert_to_shape(vs: VisualShape): Shape {
    return {
        chiral: vs.chiral,
        rotations: vs.rotations,
        points: convert_to_points(vs.points)
    }
}

// where M is month, D is a day (number),
// W is a day of the week, and " " is obstructed
// returns count of ways a piece can be placed
//
// a solution leaves one M, D, and W exposed but
// covers all other positions with blocks

function flip(ps: Point[]): Point[] {
    return ps.map(({x, y}) => ({y: y, x: -x}));
}

// negative 0 is weird, avoid it
const neg = (x:number) => x === 0 ? x : -x;

type PointMapper = (p:Point) => Point

const rotate_fns: PointMapper[] = [
    ({x, y}) => ({x: neg(y), y: x}), // 90 degrees
    ({x, y}) => ({x: neg(x), y: -y}), // 180 degrees
    ({x, y}) => ({x: y, y: neg(x)}) // 270 degrees
];

function variants(s: Shape, at: Point): Point[][] {
    const vs:Point[][] = [];
    const ts:Point[] = s.points.map(({x, y}) => ({x: x + at.x, y: y + at.y}));
    vs.push(ts);

    for (let i = 0; i < s.rotations; i++) {
        const rf = rotate_fns[i];
        vs.push(s.points.map(p => {
            const pr = rf(p);
            pr.x += at.x;
            pr.y += at.y;
            return pr;
        }));
    }

    if (s.chiral) { 
        vs.push(...vs.map(flip));
    }

    return vs;
}

// Solving Algorithm Plan:
// 1. Pick a set of squares to be exposed, mark them as occupied.
// 2. Iterate the set of shapes that still need to be placed.
// 3. For each square, attempt to place the piece into it by trying all the
//    flips and rotations.
// 4. When a placement is found where it fits, move on to the next piece.
// 5. If a piece cannot be placed, remove the previous piece and continue
//    searching for placements for that piece.
// 6. If all pieces are used, stop and report the solution that was found.
// 7. Exhaustive mode could continue to find solutions.

const shapes = vshapes.map(convert_to_shape);
const board_points = convert_to_points(vboard);

const start = performance.now();
let counter = 0;

function logBoard(board:Board) {
    console.log(convert_to_strings(board_points, (p) => board.at(p) || " ").join('\n'));
}

const board = new Board(board_points);

function find_solutions(ss = 0, solution_callback:(b:Board) => boolean, deadend_callback:(b:Board, s:Shape) => boolean):boolean {
    for (let si = ss; si < shapes.length; si++) {
        const shape = shapes[si];

        let placed = false;
        let places = 0;
        for (let bp of board.remaining()) {
            const vs = variants(shape, bp);

            for (let vi = 0; vi < vs.length; vi++) {
                const v = vs[vi];
                const remove = board.fill(v, si + "");
                counter++;

                if (counter % 1000000 === 0) {
                    console.log(counter / 1000000);
                }
                if (remove) {
                    // console.log("placed piece: " + si);
                    placed = true;
                    places++;

                    const halt = find_solutions(si + 1, solution_callback, deadend_callback);
                    if (halt) {
                        return halt; // unwind recursion
                    } else {
                        placed = false;
                        remove(); // continue
                    }
                }
            }
        }

        if (!placed) {
            if (places === 0) {
                return deadend_callback(board, shape);
            }
            return false;
        }
     }

    return solution_callback(board);
}

board.fill([{x: 1, y: 0}], "M"); // Feb
board.fill([{x: 3, y: 5}], "D"); // 25
board.fill([{x: 3, y: 6}], "W"); // Sun

console.log("Solving for:");
logBoard(board);

const verbose = false;

find_solutions(0, (board) => {
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
