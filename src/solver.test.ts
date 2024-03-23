import {describe, expect, jest, test} from '@jest/globals';
import { Point, Shape } from './geometry.js';
import { create_solver, Event } from './solver.js';

function point_rectangle(xlen: number, ylen: number):Point[] {
    let points = [];
    for (let x = 0; x < xlen; x++) {
        for (let y = 0; y < ylen; y++) {
            points.push({x, y});
        }
    }

    return points;
}

describe("solver", () => {
    test("solver finds trivial solution", () => {
        const board:Point[] = point_rectangle(3, 3);

        const shape:Shape = {
            points: board,
            chiral: false,
            rotations: 0
        };
        
        let setup_calls = 0;
        const solver = create_solver(board, {"0": shape}, (s, pi) => {
            setup_calls++;

            for (let bp of board) {
                expect(pi(bp)).toEqual(undefined);
            }

            expect(pi({x: -1, y: -1})).toEqual(" ")
        });

        expect(setup_calls).toBe(1);

        let event_calls = 0;
        let event = undefined;
        solver((pi, e) => {
            event_calls++;
            event = e;

            for (let bp of board) {
                expect(pi(bp)).toEqual("0");
            }
        })

        expect(event_calls === 1);
        expect(event).toBeDefined();
        expect(event).toHaveProperty("kind");
        expect((event as any).kind).toEqual("solved");
    })

    type SolverCase = {
        name: string,
        chiral: boolean,
        rotations: 0 | 1 | 3,
        events: string[]
    }

    const cases:SolverCase[] = [
        {
            name: "impossible",
            rotations: 0,
            chiral: false,
            events: ["failed"]
        },
        {
            name: "rotation",
            rotations: 1,
            chiral: false,
            events: ["solved"]
        },
        {
            name: "extra rotations",
            rotations: 3,
            chiral: false,
            events: ["solved", "solved"]
        },
        {
            name: "flip",
            rotations: 1,
            chiral: true,
            events: ["solved", "solved"]
        },
        {
            name: "all rotations and flip",
            rotations: 3,
            chiral: true,
            events: ["solved", "solved", "solved", "solved"]
        }
    ];

    for (const c of cases) {
        test(`solver case ${c.name}`, () => {
            const board = [{x: 0, y: 0}, {x: 1, y: 0}];
            const shape:Shape = {
                points: [{x: 0, y: 0}, {x: 0, y: 1}],
                chiral: c.chiral,
                rotations: c.rotations
            };

            const solver = create_solver(board, {"0": shape}, (s, pi) => {});
            let events:Event[] = [];

            while(solver((pi, e) => {
                events.push(e)
            })) { };
        
            expect(solver((pi, e) => { })).toEqual(false)

            expect(events.length).toEqual(c.events.length)
            for (let i = 0; i < events.length; i++) {
                expect(events[i].kind).toEqual(c.events[i])
            }
        });
    }

    test("real solver case", () => {
        const board = point_rectangle(2, 3);
        const shape:Shape = {
            points: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}],
            chiral: false,
            rotations: 3
        };

        const solver = create_solver(board, {"0": shape, "1":shape}, (s, pi) => {});
        let events:Map<string, number> = new Map();
        events.set("solved", 0);
        events.set("failed", 0);
        events.set("placed", 0);

        while(solver((pi, e) =>
        {
            expect(events.has(e.kind));
            events.set(e.kind, events.get(e.kind)! + 1)
        })) { };

        expect(events.get("solved")).toEqual(4)
        expect(events.get("failed")).toEqual(4)
        expect(events.get("placed")).toEqual(8)
    });

    test("solver with setup square filling", () => {
        const board = point_rectangle(2, 2);
        let called = false;
        create_solver(board, {}, (s, pi) => {
            const p = {x: 0, y: 1};
            expect(pi(p)).toEqual(undefined);
            s(p, "X");
            expect(pi(p)).toEqual('X');
            called = true;
        });

        expect(called).toEqual(true);
    })
});
