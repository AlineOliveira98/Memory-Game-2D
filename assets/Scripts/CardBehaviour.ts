import { playSFX } from "./Modules/Audio";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardBehaviour extends cc.Component {
    
    @property(cc.Sprite)
    public iconImage: cc.Sprite = null;

    @property(cc.Node)
    private backNode: cc.Node = null;

    @property(cc.Node)
    private frontNode: cc.Node = null;

    @property(cc.AudioClip)
    private swipeSFX: cc.AudioClip = null;

    private _isLocked: boolean = false;
    private _isRevealed: boolean = false;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
        this.hide();
    }

    init(sprite: cc.SpriteFrame) {
        this.iconImage.spriteFrame = sprite;
    }

    onClick() {
        if(this._isLocked) return;
        if(this._isRevealed) return;

        this.node.emit("card-revealed", this);
    }

    reveal() {
        this.backNode.active = false;
        this.frontNode.active = true;

        this._isRevealed = true;
        
        playSFX(this.swipeSFX);

        cc.tween(this.node)
            .to(0.1, {scale: 1.2})
            .to(0.1, {scale: 1})
            .start();
    }

    hide() {
        this.backNode.active = true;
        this.frontNode.active = false;

        this._isRevealed = false;
    }

    lock(isLocked: boolean) {
        this._isLocked = isLocked;
    }

    async pairFoundedAnim(): Promise<void> {
        return new Promise<void>((resolve) => {
            cc.tween(this.node)
            .to(0.1, {scale: 1.2})
            .to(0.1, {scale: 1}, {easing: "bounceOut"})
            .call(() => resolve())
            .start();
        });
    }

    async pairErrorAnim(): Promise<void> {
        return new Promise<void>((resolve) => {
            cc.tween(this.node)
                .delay(0.2)
                .by(0.1, { position: new cc.Vec3(10, 0, 0) })
                .by(0.1, { position: new cc.Vec3(-20, 0, 0) })
                .by(0.1, { position: new cc.Vec3(20, 0, 0) })
                .by(0.1, { position: new cc.Vec3(-10, 0, 0) })
                .call(() => {
                    this.hide();
                    resolve();
                })
                .start();
        });
    }

    get frame(): cc.SpriteFrame {
        return this.iconImage.spriteFrame;
    }
}
