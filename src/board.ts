import { Point } from "./geometry.js";

type pe = number;

function encode(p:Point): pe {
    return p.x * 16 + p.y;
}

const dirs = [
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: -1, y: 0},
    {x: 1, y: 0}
];

function add(a:Point, b:Point) {
    return {x: a.x + b.x, y: a.y + b.y}
}

export class Board {
    private filled:Map<pe, string>;
    private unfilled:Set<pe>;
    private all:Point[];

    constructor(ps:Point[]) {
        this.unfilled = new Set();
        for (let p of ps) {
            this.unfilled.add(encode(p));
        }
        
        this.filled = new Map();
        this.all = ps;
    }

    private spread(ps:Point, limit:number, accum:Set<pe>) {
        const ep = encode(ps);

        if (accum.size < limit && this.unfilled.has(ep) && !accum.has(ep)) {
            accum.add(ep);

            for (const d of dirs) {
                this.spread(add(ps, d), limit, accum);

                if (accum.size === limit) {
                    break;
                }
            }
        }
    }

    reachable(ps:Point, limit:number):number {
        const reached = new Set<pe>();
        this.spread(ps, limit, reached);

        return reached.size;
    }

    fill(ps:Point[], marker:string) {
        const eps:pe[] = [];

        for (let p of ps) {
            const ep = encode(p);
            if (!this.unfilled.has(ep)) {
                return false;
            } else {
                eps.push(ep);
            }
        }
        for (let ep of eps) {
            this.unfilled.delete(ep);
            this.filled.set(ep, marker);
        }
        return () => {
            // function to "unplace" a piece
            for (let ep of eps) {
                this.unfilled.add(ep);
                this.filled.delete(ep);
            }
        };
    }
    at(p:Point) {
        const ep = encode(p);
        if (this.unfilled.has(ep)) {
            return undefined; // fillable square
        }

        return this.filled.get(encode(p)) || ' ';
    }
    remaining() {
        return this.all.filter((p) => this.unfilled.has(encode(p)));
    }
}
