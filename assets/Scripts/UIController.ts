import GameController from "./GameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(GameController)
    private gameController: GameController = null;

    @property(cc.Label)
    private attemptsLabel: cc.Label = null;

    protected onLoad(): void {
        this.gameController.node.on("card-clicked", this.setAttempts, this);
        this.gameController.node.on("game-created", this.setAttempts, this);
    }

    start () {
        this.setAttempts();
    }

    setAttempts() {
        this.attemptsLabel.string = "Attempts Remaining: " + (this.gameController.attemptsRemaining);
    }

    restartGame() {
        this.gameController.createGame();
    }
}
