import { LabeledPoints, Point, Shape, VisualShape } from "./geometry.js";

export function convert_to_points(shape: string[], blank:string = " "): Point[] {
    const points:Point[] = [];
    for (let y = 0; y < shape.length; y++) {
        const line = shape[y];
        for (let x = 0; x < line.length; x++) {
            if (line.charAt(x) !== blank) {
                points.push({x, y});
            }
        }
    }

    return points; 
}

export function convert_to_labeled_points(shape: string[], width: number):LabeledPoints {
    const res:LabeledPoints = [];
    for (let y = 0; y < shape.length; y++) {
        const line = shape[y];
        const row = Math.ceil(line.length / width);

        for (let x = 0; x < row; x++) {
            const label = line.substring(x * width, (x + 1) * width).trim();
            if (label.length > 0) {
                res.push({label, point: {x: x, y: y}});
            }
        }
    }
    return res;
}

export function bounds(ps: Point[]): [Point, Point] {
    const minX = ps.reduce((m:number, p) => Math.min(m, p.x), Number.POSITIVE_INFINITY);
    const maxX = ps.reduce((m:number, p) => Math.max(m, p.x), Number.NEGATIVE_INFINITY);
    const minY = ps.reduce((m:number, p) => Math.min(m, p.y), Number.POSITIVE_INFINITY);
    const maxY = ps.reduce((m:number, p) => Math.max(m, p.y), Number.NEGATIVE_INFINITY);
    return [{x:minX, y:minY}, {x:maxX, y:maxY}];
}

export function convert_to_strings(ps:Point[], to_char:(p:Point) => string): string[] {
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

export function convert_to_shape(vs: VisualShape): Shape {
    return {
        chiral: vs.chiral,
        rotations: vs.rotations,
        points: convert_to_points(vs.points)
    }
}