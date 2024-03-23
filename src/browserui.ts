import { Point, LabeledShapes, LabeledPoints } from "./geometry";
import { PointInspector } from "./solver";

const blank = "#cccccc";
const SCALE = 25;

class BoardRenderer {
    private ctx:CanvasRenderingContext2D;
    private width:number;
    private height:number;

    constructor(canvas:HTMLCanvasElement, private points:LabeledPoints, private styles:Map<string, string>, private drawText:boolean = false) {
        this.ctx = canvas.getContext("2d")!;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    drawLabel(label:string, bp:Point) {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(label, (bp.x + 0.1) * SCALE, (bp.y + 0.5) * SCALE, SCALE * 0.8);
    }

    render(pi:PointInspector) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let entry of this.points) {
            const bp = entry.point;
            
            const color = this.styles.get(pi(bp) || blank);
            if (color || this.drawText) {
                this.ctx.fillStyle = color || blank;
                this.ctx.fillRect(bp.x * SCALE, bp.y * SCALE, SCALE, SCALE);
            }
            
            if (this.drawText) {
                this.drawLabel(entry.label, bp);
            }
        }
    }
}

const quantize = (value:number):number => Math.floor(value/SCALE);

function board_coords(e:MouseEvent):Point {
    return { x: quantize(e.offsetX), y: quantize(e.offsetY) };
}

const colors:string[] = [
    "#9e0142",
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#e6f598",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
    "#5e4fa2",
    "#408840",
    "#004088"
];

export function makeBrowserRenderer(points:LabeledPoints, shapes:LabeledShapes, onClickBoard:(p:Point) => void) {
    const blocks = <HTMLCanvasElement> document.getElementById("output")
    const board = <HTMLCanvasElement> document.getElementById("board")

    if (blocks && board) {
        blocks.addEventListener("click", (e:MouseEvent) => {
            onClickBoard(board_coords(e));
        }, false);

        const styles:Map<string, string> = new Map();
        let i = 0;
        for (const k in shapes) {
            styles.set(k, colors[i++]);
            if (i >= colors.length) {
                i = 0;
            }
        }

        styles.set(" ", "#00000030");

        const renderer = new BoardRenderer(blocks, points, styles);
        const boardRenderer = new BoardRenderer(board, points, styles, true);

        boardRenderer.render((pi) => undefined); // one render with all fillable squares
        return (pi:PointInspector) => {
            return renderer.render(pi);
        }
    } else {
        throw new Error("Could not find canvas for rendering!");
    }
}

export function bindToggleButton(fn:() => void):(running:boolean) => undefined {
    const button:HTMLButtonElement = <HTMLButtonElement> document.getElementById("start");
    if (button) {
        button.onclick = function() {
            fn();
        }

        return (running:boolean) => {
            button.innerText = running ? "Pause" : "Run ";
        };
    } else {
        throw new Error("Button not found!");
    }
}