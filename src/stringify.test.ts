import {describe, expect, jest, test} from '@jest/globals';
import { Point, Shape, VisualShape } from './geometry.js';
import { convert_to_labeled_points, convert_to_points, convert_to_strings, convert_to_shape } from './stringify.js';

describe("solver", () => {
    test("shape round tripping", () => {
        const str_shape = [
            "ooooo",
            " ooo ",
            "oo oo"
        ];

        const converted = convert_to_strings(convert_to_points(str_shape), (p) => "o");

        expect(converted.join("\n")).toEqual(str_shape.join("\n"));
    });

    test("convert_to_shape", () => {
        const vs:VisualShape = {
            chiral: false,
            rotations: 3,
             points: [
                "x x",
                "xxx",
                " x"
            ]
        };

        const points:Point[] = [
            {x: 0, y: 0},
            {x: 2, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1},
            {x: 2, y: 1},
            {x: 1, y: 2}
        ];

        const s = convert_to_shape(vs);
        expect(s.chiral).toEqual(vs.chiral);
        expect(s.rotations).toEqual(vs.rotations);

        const tostr = (p:Point) => "("  + p.x + ", " + p.y + ")";
        const canonicalize = (pa:Point[]) => pa.map(tostr).sort().join(" ")

        expect(canonicalize(s.points)).toEqual(canonicalize(points));
    });

    test("convert to labeled points", () => {
        const b = [
            "A B C",
            "D   E",
            "  F  "
        ];

        expect(convert_to_labeled_points(b, 2)).toEqual([
            { label: "A", point: {x: 0, y: 0}},
            { label: "B", point: {x: 1, y: 0}},
            { label: "C", point: {x: 2, y: 0}},
            { label: "D", point: {x: 0, y: 1}},
            { label: "E", point: {x: 2, y: 1}},
            { label: "F", point: {x: 1, y: 2}}    
        ]);
    });
});