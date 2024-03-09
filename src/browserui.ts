import { Point, LabeledPoints } from "./geometry";
import { PointInspector } from "./solver";

const styles:Map<string, string> = new Map();
styles.set("0", "#9e0142");
styles.set("9", "#d53e4f");
styles.set("1", "#f46d43");
styles.set("8", "#fdae61");
styles.set("2", "#fee08b");
styles.set("7", "#e6f598");
styles.set("3", "#abdda4");
styles.set("6", "#66c2a5");
styles.set("4", "#3288bd");
styles.set("5", "#5e4fa2");
styles.set(".", "#cccccc");

const SCALE = 25;

class BoardRenderer {
    private ctx:CanvasRenderingContext2D;

    constructor(canvas:HTMLCanvasElement, private labels:LabeledPoints) {
        this.ctx = canvas.getContext("2d")!;
    }

    render(pi:PointInspector) {
        for (let entry of this.labels.entries()) {
            const [_, bp] = entry;
            const color = styles.get(pi(bp));
            this.ctx.fillStyle = color || "#000000";
            this.ctx.fillRect(bp.x * SCALE, bp.y * SCALE, SCALE, SCALE);
        }
    }
}

const quantize = (value:number):number => Math.floor(value/SCALE);

function board_coords(e:MouseEvent):Point {
    return { x: quantize(e.offsetX), y: quantize(e.offsetY) };
}

export function makeBrowserRenderer(points:LabeledPoints, onClickBoard:(p:Point) => void) {
    const canvas = <HTMLCanvasElement> document.getElementById("output")
    if (canvas) {
        canvas.addEventListener("click", (e:MouseEvent) => {
            onClickBoard(board_coords(e));
        }, false);

        const renderer = new BoardRenderer(canvas, points);
        return (pi:PointInspector) => {
            return renderer.render(pi);
        }
    } else {
        throw new Error("Could not find canvas for rendering!");
    }
}
