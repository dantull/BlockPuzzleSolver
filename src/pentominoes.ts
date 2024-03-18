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

export const V:VisualShape = Object.freeze({
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

export const F:VisualShape = Object.freeze({
    chiral: true,
    rotations: 3,
    points: [
        "OO",
        " OO",
        " O"
    ]
});

export const W:VisualShape = Object.freeze({
    chiral: false,
    rotations: 3,
    points: [
        "OO",
        " OO",
        "  O"
    ]
});

export const X:VisualShape = Object.freeze({
    chiral: false,
    rotations: 0,
    points: [
        " O",
        "OOO",
        " O"
    ]
});

export const Y:VisualShape = Object.freeze({
    chiral: true,
    rotations: 3,
    points: [
        "O",
        "O",
        "OO",
        "O"
    ]
});

export const I:VisualShape = Object.freeze({
    chiral: false,
    rotations: 1,
    points: [
        "O",
        "O",
        "O",
        "O",
        "O"
    ]
});