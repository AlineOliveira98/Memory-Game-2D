import GameController from "./GameController";
import TimeController from "./TimeController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(GameController)
    private gameController: GameController = null;

    @property(TimeController)
    private timeController: TimeController = null;

    @property(cc.Label)
    private attemptsLabel: cc.Label = null;

    @property(cc.Label)
    private timeLabel: cc.Label = null;

    @property(cc.Label)
    private recordTimeLabel: cc.Label = null;

    protected onLoad(): void {
        this.gameController.node.on("card-clicked", this.setAttempts, this);
        this.gameController.node.on("game-created", this.setAttempts, this);
    }

    start () {
        this.setAttempts();

        const recordTime = cc.sys.localStorage.getItem('record-time');
        this.recordTimeLabel.string = "Record time: " + this.timeController.formatTime(recordTime);
    }

    protected update(dt: number): void {
        this.timeLabel.string = `${this.timeController.elapsedTimeFormatted}`;
    }

    setAttempts() {
        this.attemptsLabel.string = "Attempts Remaining: " + (this.gameController.attemptsRemaining);
    }

    restartGame() {
        this.gameController.createGame();
    }
}
