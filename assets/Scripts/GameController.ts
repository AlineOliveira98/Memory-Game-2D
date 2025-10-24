import CardBehaviour from "./CardBehaviour";
import { playSFX, playMusic, setSFXVolume, setMusicVolume } from "./Modules/Audio";
import { playHaptics } from "./Modules/Haptics";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(cc.Integer)
    private maxAttempts: number = 24;

    @property(cc.Integer) 
    private columsAmount: number = 4;

    @property(cc.Vec2)
    private spaceBetweenCards: cc.Vec2 = cc.v2(0, 0);

    @property(cc.Prefab)
    private cardPrefab: cc.Prefab = null;

    @property([cc.SpriteFrame])
    private cardImages: cc.SpriteFrame[] = [];

    @property(cc.AudioClip)
    private pairSuccessSFX: cc.AudioClip = null;

    @property(cc.AudioClip)
    private pairFailSFX: cc.AudioClip = null;

    @property(cc.AudioClip)
    private music: cc.AudioClip = null;

    private _isStarted: boolean = false;

    public get isStarted(): boolean {
        return this._isStarted;
    }

    private _isGameOver: boolean = false;

    public get isGameOver(): boolean {
        return this._isGameOver;
    }

    private _cardRevealed: CardBehaviour = null;
    private _allCards: CardBehaviour[] = [];
    private _pairsRemaining: number = 0;
    private _attemptsRemaining: number = 0;

    public get attemptsRemaining(): number {
        return this._attemptsRemaining;
    }

    start () {
        setMusicVolume(0.2);
        setSFXVolume(0.1);

        playMusic(this.music);
        this.createGame();
    }

    createGame() {
        this._pairsRemaining = this.cardImages.length;
        this._attemptsRemaining = this.maxAttempts;

        this.spawnCards();
        this._isStarted = true;
        this._isGameOver = false;

        this.node.emit("game-created");
    }

    private spawnCards() {
        this.node.destroyAllChildren();
        this._allCards = [];

        const allImages = [...this.cardImages, ...this.cardImages];

        this.shuffleArray(allImages);

        const rowsAmount = allImages.length / this.columsAmount;

        for (let i = 0; i < allImages.length; i++) {
            const element = allImages[i];

            const cardNode = cc.instantiate(this.cardPrefab);
            const card = cardNode.getComponent(CardBehaviour);
            
            card.init(element);

            cardNode.name = "Card - " + (i+1);
            cardNode.setParent(this.node);
            cardNode.on("card-revealed", this.onCardClicked, this);

            const x = (i % this.columsAmount) * this.spaceBetweenCards.x - ((this.columsAmount - 1) * this.spaceBetweenCards.x) / 2;
            const y = -Math.floor(i / this.columsAmount) * this.spaceBetweenCards.y + ((rowsAmount - 1) * this.spaceBetweenCards.y) / 2;
            cardNode.setPosition(x, y);
            
            this._allCards.push(card);
        }
    }

    private shuffleArray<T>(array: T[]) : T[] {
        for (let i = array.length - 1; i > 0 ; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
        }

        return array;
    }

    private async onCardClicked(card: CardBehaviour) {
        if(!this._isStarted || this._isGameOver) return;

        card.reveal();

        if(!this._cardRevealed) {
            this._cardRevealed = card;
            return;
        }

        if(this._cardRevealed === card) return;

        this.lockCards(true);

        if(this._cardRevealed.frame === card.frame) {
            await this.pairSuccess(card);
        } else {
            await this.pairNotFound(card);
        }

        this._cardRevealed = null;
        this.lockCards(false);

        this._attemptsRemaining = Math.max(0, this._attemptsRemaining-1);

        this.node.emit("card-clicked");

        this.checkGameOver();
    }

    private async pairSuccess(card: CardBehaviour) {
        this._pairsRemaining = Math.max(0, this._pairsRemaining-1);

        this._cardRevealed.pairFoundedAnim();
        await card.pairFoundedAnim();

        playHaptics(100);
        playSFX(this.pairSuccessSFX);
    }

    private async pairNotFound(card: CardBehaviour) {
        this._cardRevealed.pairErrorAnim();
        await card.pairErrorAnim();

        playHaptics(50);
        playSFX(this.pairFailSFX);
    }

    private checkGameOver() {
        if(this._pairsRemaining <= 0) {
            this.gameOver(true);
        } else if(this._attemptsRemaining <= 0) {
            this.gameOver(false);   
        } 
    }

    private gameOver(isVictory: boolean) {
        if(isVictory) {
            console.log("Victory!");
        } else {
            console.log("Defeat!");
        }

        this._isGameOver = true;
    }

    private waitSeconds(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds));
    }

    private lockCards(lock: boolean) {
        this._allCards.forEach(element => {
            element.lock(lock);
        });
    }
}
