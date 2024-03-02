import { Board } from "./board.js";
import { Point, Shape } from "./geometry.js";

// negative 0 is weird, avoid it
const neg = (x:number) => x === 0 ? x : -x;

function flip(ps: Point[]): Point[] {
    return ps.map(({x, y}) => ({y: y, x: neg(x)}));
}

type PointMapper = (p:Point) => Point

const rotate_fns: PointMapper[] = [
    ({x, y}) => ({x: neg(y), y: x}), // 90 degrees
    ({x, y}) => ({x: neg(x), y: neg(y)}), // 180 degrees
    ({x, y}) => ({x: y, y: neg(x)}) // 270 degrees
];

// FIXME: when the operations are done in this order, the
// results do not all start from the same origin square,
// which could cause the search to fail to find an opening
// for the piece just because the flipped orientation does
// not line up right
//
// a first attempt to fix this made it take longer to find
// solutions, so I need to think on this more.
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

class ShapeState {
    private pi: number = 0;
    private variants: Point[][];
    private vi = 0;
    private remove: (() => void) | false = false;
    private places: number = 0;

    constructor(private shape: Shape, private points:Point[]) {
        this.variants = this.newVariants();
    }

    private newVariants() {
        return this.pi < this.points.length ? variants(this.shape, this.points[this.pi]) : []
    }

    step(board:Board, si:number) {
        if (this.remove) {
            this.remove();
            this.remove = false;
        }
        
        if (this.vi < this.variants.length) {
            const v = this.variants[this.vi];

            this.remove = board.fill(v, si + "");

            if (this.remove) {
                this.places++;
            }

            this.vi++;
        } else if (this.vi === this.variants.length) {
            this.pi++;
            this.variants = this.newVariants()
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

    setup_callback((p, m) => board.fill([p], m), (p) => board.at(p));

    let stack: ShapeState[] = [];

    const nextShape = () => new ShapeState(shapes[stack.length], board.remaining());

    stack.push(nextShape());

    return (sln_cb, de_cb) => {
        let more = true;
        let ss = stack.pop()!;

        while (more) {
            more = ss.step(board, stack.length);

            if (ss.placed()) {
                stack.push(ss);
                if (stack.length === shapes.length) {
                    if (sln_cb((p) => board.at(p))) {
                        return true;
                    }
                } else {
                    ss = nextShape(); // piece placed, prepare the next one
                }
            } else if (!more) {
                if (ss.noplace() && de_cb((p) => board.at(p), shapes[stack.length])) {
                    return true;
                }

                ss = stack.pop()!; // resume previous shape
                more = true
            }
        }

        return true;
    };
}
