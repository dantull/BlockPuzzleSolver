// 10 unique pieces, some of which differ when flipped (chirality)
// and rotated (usually 4 shapes, but tetra I only has 2)

import { Point } from "./geometry.js";
import { Runner } from "./runner.js";
import { create_solver, Event, PointInspector, Setter, Solver }from "./solver.js";
import { bindToggleButton, makeBrowserRenderer } from "./browserui.js";
import { definitions } from "./calendar.js";

const defs = definitions();

let render:(ps:PointInspector) => void = () => {};
let solver:Solver | undefined;
const state = new Runner();
const points:Point[] = [];

function makeRenderer() {
    return makeBrowserRenderer(defs.labels, (p:Point) => {
        state.stop();
        solver = undefined;
        points.push(p);
        
        while (points.length > 3) {
            points.shift();
        }

        render((p) => {
            if (points.find((v) => v.x === p.x && v.y === p.y)) {
                return " ";
            } else {
                return undefined;
            }
        });
    });
}

render = makeRenderer();

function loop() {
    if (!state.running()) {
        return;
    }

    if (!solver) {
        solver = create_solver(defs.board, defs.shapes, (set:Setter, pi:PointInspector) => {
            for (let i = 0; i < points.length; i++) {
                set(points[i], " ");
            }
        });
    }

    let t = performance.now();
    for(let i = 0; i < 50000 && state.running(); i++) {
        const more = solver && solver((pi, m) => {
            if (m.kind === "solved") {
                render(pi);
                state.stop();
            } else {
                let nt = performance.now()
                let dt = nt - t;
                if (dt > 1000/120) {
                    render(pi);
                    t = nt;
                }
            }
        });
        if (!more) {
            state.stop();
        }
    }
}

function solve() {
    state.start(() => loop());
}

const toggled = bindToggleButton(() => {
    if (!state.running()) {
        solve();
    } else {
        state.stop();
    }
});

state.listener(toggled);

//# sourceMappingURL=main.js.map
