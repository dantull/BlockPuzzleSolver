// 10 unique pieces, some of which differ when flipped (chirality)
// and rotated (usually 4 shapes, but tetra I only has 2)

import { Point, Shape, VisualShape } from "./geometry.js";
import { convert_to_shape, convert_to_strings, convert_to_labeled_points } from "./stringify.js";
import { Runner } from "./runner.js";
import { create_solver, Event, PointInspector, Setter, Solver }from "./solver.js";
import { makeBrowserRenderer } from "./browserui.js";

const vshapes: VisualShape[] = [
    {   // tetra I
        chiral: false,
        rotations: 1,
        points: [   
        "OOOO"
        ]
    },
    {   // tetra L/J
        chiral: true,
        rotations: 3,
        points: [
        "OOO",
        "O"
    ]},
    {   // tetra S/Z
        chiral: true,
        rotations: 1,
        points: [   
        "OO",
        " OO"
    ]},
    {   // penta L/Q
        chiral: true,
        rotations: 3,
        points: [
        "OOOO",
        "O"
    ]},
    {   // penta N/S
        chiral: true,
        rotations: 3,
        points: [
        "OOO",
        "  OO"
    ]},
    {   // penta U
        chiral: false,
        rotations: 3,
        points: [
        "OOO",
        "O O"
    ]},
    {   // penta T
        chiral: false,
        rotations: 3,
        points: [
        "OOO",
        " O",
        " O"
    ]},
    {   // penta P
        chiral: true,
        rotations: 3,
        points: [
        "OOO",
        "OO"
    ]},
    {   // penta V
        chiral: false,
        rotations: 3,
        points: [
        "OOO",
        "O",
        "O"
    ]},
    {   // penta Z
        chiral: true,
        rotations: 1,
        points: [
        "OO",
        " O",
        " OO"
    ]},
];

// Board is shaped like this:
const vboard: string[] = [
    "Jan Feb Mar Apr May Jun",
    "Jul Aug Sep Oct Nov Dec",
    "  1   2   3   4   5   6   7",
    "  8   9  10  11  12  13  14",
    " 15  16  17  18  19  20  21",
    " 22  23  24  25  26  27  28",
    " 29  30  31 Sun Mon Tue Wed",
    "                Thu Fri Sat"
];

const shapes = vshapes.map(convert_to_shape);
const labeledPoints = convert_to_labeled_points(vboard, 4);
const board_points = labeledPoints.map(e => e.point);

const start = performance.now();
const state = new Runner();

function logBoard(pi:PointInspector) {
    console.log(convert_to_strings(board_points, (p) => pi(p) || " ").join('\n'));
}

const verbose = false;

const points:Point[] = [];

function prepareSolver() {
    return create_solver(board_points, shapes, (set:Setter, pi:PointInspector) => {
        for (let i = 0; i < points.length; i++) {
            set(points[i], " ");
        }

        console.log("Solving for:");
        logBoard(pi);
    });
}

const browser = (typeof window === "object");

let updateOnClick:(ps:PointInspector) => void = () => {};

function makeRenderer() {
    if (browser) {
        return makeBrowserRenderer(labeledPoints, (p:Point) => {
            state.stop();
            solver = undefined;
            points.push(p);
            
            while (points.length > 3) {
                points.shift();
            }

            updateOnClick((p) => {
                if (points.find((v) => v.x === p.x && v.y === p.y)) {
                    return " ";
                } else {
                    return ".";
                }
            });
        });
    }

    let counter = 0;
    const stepping = 1e5;

    return (pi:PointInspector) => {
        counter++;

        if (counter % stepping === 0) {
            console.log(counter / stepping);
        }
    }
}

const render = makeRenderer();
updateOnClick = render

const callback = (pi:PointInspector, e:Event) => {
    if (e.kind === "solved") {
        console.log("solution:");
        logBoard(pi);
        console.log("elapsed time: " + ((performance.now() - start) / 1000));
        state.stop();
    } else if (verbose && e.kind === "failed") {
        console.log("failed to place: ");
        console.log(convert_to_strings(e.shape.points, (p) => "O").join('\n'));
        console.log("into");
        logBoard(pi);
        console.log("--------")
    }

    render(pi);
}

let solver:Solver | undefined;

function loop() {
    if (!state.running()) {
        return;
    }

    if (!solver) {
        solver = prepareSolver();
    }

    for(let i = 0; i < 50000 && state.running(); i++) {
        const more = solver && solver(callback);
        if (!more) {
            state.stop();
        }
    }
}

function solve() {
    state.start(loop);
}

if (!browser) {
    const args = new Set(process.argv);
    const picked = labeledPoints.filter((lp) => args.has(lp.label));
    if (picked.length <= 3) {
        console.log("Picked: " + picked.map((lp) => lp.label).join(", "));
        picked.forEach((lp) => points.push(lp.point));
        solve();
    } else {
        console.log("Too many arguments (should be 3 or fewer)");
        process.exit(1);
    }
} else {
    const button:HTMLButtonElement = <HTMLButtonElement> document.getElementById("start");
    if (button) {
        button.onclick = function() {
            if (!state.running()) {
                solve();
            } else {
                state.stop();
            }
        }

        state.listener((running) => {
            button.innerText = running ? "Pause" : "Run ";
        })
    }
}

//# sourceMappingURL=main.js.map
