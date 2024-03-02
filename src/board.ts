import { Point } from "./geometry.js";

type pe = number;

function encode(p:Point): pe {
    return p.x * 16 + p.y;
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
            return "."; // fillable square
        }

        return this.filled.get(encode(p)) || ' ';
    }
    check(p:Point) {
        return this.unfilled.has(encode(p));
    }
    left() {
        return this.unfilled.size;
    }
    remaining() {
        return this.all.filter((p) => this.unfilled.has(encode(p)));
    }
}
