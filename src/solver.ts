import { Board } from "./board.js";
import { Point, Shape } from "./geometry.js";

// negative 0 is weird, avoid it
const neg = (x:number) => x === 0 ? x : -x;

type PointMapper = (p:Point) => Point

const flip:PointMapper = ({x, y}) => ({y: y, x: neg(x)});

const rotate_fns: PointMapper[] = [
    ({x, y}) => ({x: x, y: y}), // 0 degrees
    ({x, y}) => ({x: neg(y), y: x}), // 90 degrees
    ({x, y}) => ({x: neg(x), y: neg(y)}), // 180 degrees
    ({x, y}) => ({x: y, y: neg(x)}) // 270 degrees
];

const noop:PointMapper = (p:Point):Point => p;

function variants(s: Shape): Point[][] {
    const vs:Point[][] = [];
    const flips = s.chiral ? [noop, flip] : [noop];

    for (let f = 0; f < flips.length; f++) {
        const ff = flips[f];
        for (let i = 0; i <= s.rotations; i++) {
            const rf = rotate_fns[i];
            vs.push(s.points.map(p => {
                return ff(rf(p));
            }));
        }
    }

    return vs;
}

function offsetOne(p:Point, at:Point) {
    return {x:p.x + at.x, y:p.y + at.y};
}

function offsetAll(ps:Point[], at:Point): Point[] {
    return ps.map((p) => offsetOne(p, at));
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

export type Event = { kind: "placed" | "failed" | "solved", shape: Shape }
export type Solver = (callback:(pi:PointInspector, m:Event) => void) => boolean
export type PointInspector = (p:Point) => string
export type Setter = (p:Point, m:string) => void

class ShapeState {
    private pi: number = 0;
    private vi = 0;
    private remove: (() => void) | false = false;
    private places: number = 0;

    constructor(public shape: Shape, private baseVariants:Point[][], private points:Point[]) {
    }

    step(board:Board, si:number) {
        if (this.remove) {
            this.remove();
            this.remove = false;
        }
        
        if (this.vi < this.baseVariants.length) {
            const v = offsetAll(this.baseVariants[this.vi], this.points[this.pi]);

            this.remove = board.fill(v, si + "");

            if (this.remove) {
                this.places++;
            }

            this.vi++;
        } else if (this.vi === this.baseVariants.length) {
            this.pi++;
            this.vi = 0;
        }

        return this.pi < this.points.length; // end of iteration when pi passes end of points
    }

    placed() {
        return this.remove !== false
    }

    noplace() {
        return this.places === 0;
    }
}

export function create_solver(board_points: Point[], shapes: Shape[], setup_callback:((s:Setter, pi:PointInspector) => void)):Solver {
    const board = new Board(board_points);
    const pi = (p:Point) => board.at(p)

    setup_callback((p, m) => board.fill([p], m), (p) => board.at(p));

    let stack: ShapeState[] = [];
    let allBaseVariants: Point[][][] = shapes.map(variants);

    const nextShape = () => new ShapeState(shapes[stack.length], allBaseVariants[stack.length], board.remaining());

    stack.push(nextShape());

    return (cb) => {
        let ss = stack[stack.length - 1];

        if (!ss) {
            return false;
        }

        const more = ss.step(board, stack.length - 1);

        if (!more) {
            if (ss.noplace()) {
                cb(pi, { kind: "failed", shape: ss.shape })
            }
            stack.pop();

            return stack.length > 0;
        } else {
            if (ss.placed()) {
                const solved = stack.length === shapes.length
                cb(pi, { kind: solved ? "solved" : "placed", shape: ss.shape })
                if (!solved) {
                    stack.push(nextShape());
                }
            }

            return true;
        }
    };
}
