const {ccclass, property} = cc._decorator;

@ccclass
export default class TimeController extends cc.Component {
    
    private _canRun: boolean = false;
    private _elapsedTime: number = 0;

    public get elapsedTime(): number {
        return this._elapsedTime;
    }

    public get elapsedTimeFormatted(): string {
        return this.formatTime(this._elapsedTime);
    }
    
    protected update(dt: number): void {
        if(!this._canRun) return;

        this._elapsedTime += dt;
    }

    public setEnable(canRun: boolean) {
        this._canRun = canRun;
    }

    public reset() {
        this._elapsedTime = 0;
    }

    public formatTime(seconds: number): string {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);

        const formattedMin = min < 10 ? '0' + min : min;
        const formattedSec = sec < 10 ? '0' + sec : sec;

        return `${formattedMin}:${formattedSec}`;
    }
}
