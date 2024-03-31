import {describe, expect, test} from '@jest/globals';
import { partialSolve, continueSolve, SolverConfig } from './parallelizer.js';
import { convert_to_points, convert_to_shape, convert_to_strings } from './stringify.js';
import { Event, PointInspector } from './solver.js';
import { L, P } from './pentominoes.js';

describe("board", () => {
    test("solver", () => {
        const grid = [
            "oooo",
            "oooo",
            "oooo"
        ];

        const board = convert_to_points(grid);
        const blocked = convert_to_points(["x  x"]);
        const shapes = {L: convert_to_shape(L), P: convert_to_shape(P)};
        const inspectPartial = (pi:PointInspector) => {
            for (const p of blocked) {
                expect(pi(p)).toBeTruthy();
            }
        };

        const cb = partialSolve(board, shapes, blocked, inspectPartial);
        const partials:SolverConfig[] = [];
        while(cb((sc) => {
            partials.push(sc);
        })) {
        }

        expect(partials.length).toBeGreaterThan(0);

        const count = 0
        const inspectContinue = (pi:PointInspector) => {
            for (const p of blocked) {
                expect(pi(p)).toBeTruthy();
            }
            let count = 0;
            for (const p of board) {
                if (pi(p) !== undefined) {
                    count++;
                }
            }

            expect(count).toEqual(5 + blocked.length);
        };

        let solns = 0;
        const solvers = partials.map((sc:SolverConfig) => continueSolve(sc, inspectContinue));
        for (const s of solvers) {
            while(s((pi:PointInspector, e:Event) => {
                if (e.kind === "solved") {
                    solns++;
                    for (const p of board) {
                        expect(pi(p)).toBeTruthy();
                    }
                }
            })) {
            };
        }

        expect(solns).toBe(2);
    });
});