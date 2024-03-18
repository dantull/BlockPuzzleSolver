import { VisualShape } from "./geometry";

export const L:VisualShape = Object.freeze({
    chiral: true,
    rotations: 3,
    points: [
        "OOOO",
        "O"
    ]
});

export const N:VisualShape = Object.freeze({
    chiral: true,
    rotations: 3,
    points: [
        "OOO",
        "  OO"
    ]
});

export const U:VisualShape = Object.freeze({
    chiral: false,
    rotations: 3,
    points: [
        "OOO",
        "O O"
    ]
});

export const T:VisualShape = Object.freeze({
    chiral: false,
    rotations: 3,
    points: [
        "OOO",
        " O",
        " O"
    ]
});

export const P:VisualShape = Object.freeze({
    chiral: true,
    rotations: 3,
    points: [
        "OOO",
        "OO"
    ]
});

export const V:VisualShape = Object.freeze({   // penta V
    chiral: false,
    rotations: 3,
    points: [
        "OOO",
        "O",
        "O"
    ]
});

export const Z:VisualShape = Object.freeze({
    chiral: true,
    rotations: 1,
    points: [
        "OO",
        " O",
        " OO"
    ]
});

export const F = Object.freeze({});
export const W = Object.freeze({});
export const X = Object.freeze({});
export const Y = Object.freeze({});
export const I = Object.freeze({});