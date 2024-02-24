import { Board } from "./board";
import { Point, Shape } from "./types";

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

export type Solver = (solution_callback:(pi:PointInspector) => boolean, deadend_callback:(pi:PointInspector, s:Shape) => boolean) => boolean
export type PointInspector = (p:Point) => string
export type Setter = (p:Point, m:string) => void

export function create_solver(board_points: Point[], shapes: Shape[], setup_callback:((s:Setter, pi:PointInspector) => void)):Solver {
    let counter = 0;

    const board = new Board(board_points);

    setup_callback((p, m) => {
        board.fill([p], m);
    }, (p) => board.at(p));
    
    function find_solutions(ss = 0, solution_callback:(pi:PointInspector) => boolean, deadend_callback:(pi:PointInspector, s:Shape) => boolean):boolean {
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
                    return deadend_callback((p) => board.at(p), shape);
                }
                return false;
            }
        }

        return solution_callback((p) => board.at(p));
    }

    return (sln_cb, de_cb) => {
        return find_solutions(0, sln_cb, de_cb)
    };
}
