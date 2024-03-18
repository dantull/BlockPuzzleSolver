import { VisualShape } from "./geometry.js";
import { convert_to_shape, convert_to_labeled_points } from "./stringify.js";
import { L, N, U, T, P, V, Z, F, I, W, X, Y } from "./pentominoes.js";

const vshapes: VisualShape[] = [
    W, X, L, N, U, T, P, V, Z, F, I, Y
];

// Board is shaped like this:
const vboard: string[] = [
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    ".........."
];

const shapes = vshapes.map(convert_to_shape);
const labels = convert_to_labeled_points(vboard, 1);
const board = labels.map(e => e.point);

const pentaGridDefinitions = {
    shapes,
    labels,
    board
};

export function definitions() {
    return pentaGridDefinitions
};