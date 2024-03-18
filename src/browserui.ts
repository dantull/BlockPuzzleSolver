import { Point, LabeledPoints } from "./geometry";
import { PointInspector } from "./solver";

const styles:Map<string, string> = new Map();
styles.set("0", "#9e0142");
styles.set("9", "#d53e4f");
styles.set("A", "#408840");
styles.set("B", "#004088");
styles.set("1", "#f46d43");
styles.set("8", "#fdae61");
styles.set("2", "#fee08b");
styles.set("7", "#e6f598");
styles.set("3", "#abdda4");
styles.set("6", "#66c2a5");
styles.set("4", "#3288bd");
styles.set("5", "#5e4fa2");
styles.set(" ", "#00000030");

const blank = "#cccccc";
const SCALE = 25;

class BoardRenderer {
    private ctx:CanvasRenderingContext2D;
    private width:number;
    private height:number;

    constructor(canvas:HTMLCanvasElement, private points:LabeledPoints, private drawText:boolean = false) {
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
            
            const color = styles.get(pi(bp) || blank);
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

export function makeBrowserRenderer(points:LabeledPoints, onClickBoard:(p:Point) => void) {
    const blocks = <HTMLCanvasElement> document.getElementById("output")
    const board = <HTMLCanvasElement> document.getElementById("board")

    if (blocks && board) {
        blocks.addEventListener("click", (e:MouseEvent) => {
            onClickBoard(board_coords(e));
        }, false);

        const renderer = new BoardRenderer(blocks, points);
        const boardRenderer = new BoardRenderer(board, points, true);

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