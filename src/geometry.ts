export type Point = { x: number, y: number}
export type LabeledPoints = Map<string, Point>;

export type ShapeAttrs = {
    chiral: boolean, // whether the piece differs when mirrored
    rotations: 0 | 1 | 3, // the I/Z only have 2 (90 degree) alternate, all others have 3 alternates, a square has no rotations
};

export type VisualShape = {
    points: string[]
} & ShapeAttrs;

export type Shape = {
    points: Point[] // array of points  
} & ShapeAttrs;
