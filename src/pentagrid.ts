import { VisualShape } from "./geometry.js";
import { convert_to_shape, convert_to_labeled_points } from "./stringify.js";
import { L, N, U, T, P, V, Z, F, I, W, X, Y } from "./pentominoes.js";

// Board is shaped like this:
const vboard: string[] = [
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    ".........."
];

const shapes = {
    W: convert_to_shape(W),
    X: convert_to_shape(X),
    L: convert_to_shape(L),
    N: convert_to_shape(N),
    U: convert_to_shape(U),
    T: convert_to_shape(T),
    P: convert_to_shape(P),
    V: convert_to_shape(V),
    Z: convert_to_shape(Z),
    F: convert_to_shape(F),
    I: convert_to_shape(I),
    Y: convert_to_shape(Y)
};
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