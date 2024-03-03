import {describe, expect, jest, test} from '@jest/globals';
import { Point, Shape } from './geometry.js';
import { create_solver, Event } from './solver.js';

describe("solver", () => {
    test("solver finds trivial solution", () => {
        const board = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                board.push({x, y});
            }
        }

        const shape:Shape = {
            points: board,
            chiral: false,
            rotations: 0
        };
        
        let setup_calls = 0;
        const solver = create_solver(board, [shape], (s, pi) => {
            setup_calls++;
        });

        expect(setup_calls).toBe(1);

        let event_calls = 0;
        let event = undefined;
        solver((pi, e) => {
            event_calls++;
            event = e;
        })

        expect(event_calls === 1);
        expect(event).toBeDefined();
        expect(event).toHaveProperty("kind");
        expect((event as any).kind).toEqual("solved");
    })
});