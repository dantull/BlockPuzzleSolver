import { Point } from "./geometry";

function encode(p:Point): string {
    return p.x + "_" + p.y;
}

export class Board {
    private filled:Map<string, string>;
    private unfilled:Set<string>;
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
        const eps = ps.map(encode);

        for (let ep of eps) {
            if (!this.unfilled.has(ep)) {
                return false;
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
