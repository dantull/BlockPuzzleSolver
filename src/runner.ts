type ScheduleState = {
    name: "running",
    handle: number | NodeJS.Timeout
} | {
    name: "paused"
};

export class Runner {
    private state:ScheduleState = {name: "paused"};

    constructor(private callback = (_:boolean) => undefined, 
        private si:typeof setInterval = setInterval, 
        private ci:typeof clearInterval = clearInterval) {
    }

    stop() {
        if (this.state.name === "running") {
            clearInterval(this.state.handle);
        }

        this.state = {name: "paused"}
        this.callback(this.running())
    }

    start(fn:() => void) {
        this.state = {name: "running", handle: setInterval(fn, 0)}
        this.callback(this.running())
    }

    running():boolean {
        return this.state.name === "running";
    }

    listener(callback:(running:boolean) => undefined) {
        this.callback = callback;
        this.callback(this.running());
    }
}
