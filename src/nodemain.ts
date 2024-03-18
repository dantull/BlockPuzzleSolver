import { LabeledPoints, Point, Shape } from "./geometry.js";
import { convert_to_strings } from "./stringify.js";
import { create_solver, Event, PointInspector, Setter, Solver }from "./solver.js";

import worker from "node:worker_threads";
import { fileURLToPath } from 'url';

import { definitions } from "./calendar.js";

type WorkerTask = {
    id: number,
    verbose: boolean,
    placed: Point[],
    picked: Point[],
    shapes: Shape[],
    board_points: Point[]
};

type Solution = {
    id: number,
    text: string,
    board: LabeledPoints
};

const defs = definitions();

function toString(pi:PointInspector) {
    return convert_to_strings(defs.board, (p) => pi(p) || ".").join('\n')
}

function logBoard(pi:PointInspector) {
    console.log(toString(pi));
}

if (worker.isMainThread) {
    const args = new Set(process.argv);
    const verbose = args.has("verbose");

    const picked = defs.labels.filter((lp) => args.has(lp.label));
    const many = args.has("many");
    if (picked.length <= 3) {
        const start = performance.now();

        console.log(`Picked: ${picked.map((lp) => lp.label).join(", ")}`);
        const solver:Solver = create_solver(defs.board, defs.shapes.slice(0, 1), (set:Setter, pi:PointInspector) => {
            picked.forEach((lp) => set(lp.point, "X"));
    
            console.log("Solving for:");
            logBoard(pi);
        });

        let id = 0;
        const remainingShapes = defs.shapes.slice(1);

        const callback = (pi:PointInspector, e:Event) => {
            if (e.kind === "solved") {
                const piece = defs.board.filter(p => pi(p) === '0');

                const task:WorkerTask = {
                    id: id++,
                    verbose,
                    placed: piece,
                    picked: picked.map(lp => lp.point),
                    shapes: remainingShapes,
                    board_points: defs.board
                };

                const w = new worker.Worker(fileURLToPath(import.meta.url), {
                    workerData: task
                });

                w.on("message", (sln:Solution) => {
                    console.log(`Worker: ${sln.id}\n${sln.text}\n`);
                    console.log(`Elapsed: ${(performance.now() - start) / 1000}`);

                    if (!many) {
                        process.exit(0); // stop after first
                    }
                });
            }
        }
    
        while(solver(callback)) { }

        if (verbose) {
            console.log(`spawned ${id} workers`);
        }

    } else {
        console.log("Too many arguments (should be 3 or fewer)");
        process.exit(1);
    }
} else {
    const task = worker.workerData as WorkerTask;
    const solver:Solver = create_solver(task.board_points, task.shapes, (set:Setter, pi:PointInspector) => {
        task.picked.forEach((p) => set(p, "X"));
        task.placed.forEach((p) => set(p, "!"));

        if (task.verbose) {
            console.log(`Worker ${task.id} Solving for: \n${toString(pi)}`);
        }
    });

    const callback = (pi:PointInspector, e:Event) => {
        if (e.kind === "solved") {
            const board = task.board_points.map((p) => { return { label: pi(p) || "", point: p}});

            const sln:Solution = {
                id: task.id,
                text: toString(pi),
                board: board
            };
            worker.parentPort?.postMessage(sln);
        }
    };

    while(solver(callback)) { }

    if (task.verbose) {
        console.log(`Worker ${task.id} finished.`);
    }
}
