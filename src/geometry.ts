export type Point = { x: number, y: number}

export type ShapeAttrs = {
    chiral: boolean, // whether the piece differs when mirrored
    rotations: 1 | 3, // the I/Z only have 2 (90 degree) alternate, all others have 3 alternates  
};

export type VisualShape = {
    points: string[]
} & ShapeAttrs;

export type Shape = {
    points: Point[] // array of points  
} & ShapeAttrs;
