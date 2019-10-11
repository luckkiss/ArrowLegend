import GameBG from "./GameBG";
import Game from "./Game";
import GameHitBox from "./GameHitBox";
import GamePro from "./GamePro";

export default class GameThorn extends Laya.Box{
    static TAG:string = "GameThorn";
    private lastTime:number = 0;
    public hbox:GameHitBox = new GameHitBox(GameBG.ww, GameBG.ww);
    static arr:GameThorn[] = [];
    public inDanger:boolean = false;

    private cd:number = 1500;

    diciPro:GamePro;

    private img1:Laya.Image;
    private img0:Laya.Image;
    constructor(){
        super();
        this.diciPro = new GamePro(8,0);
        this.diciPro.hurtValue = 150;

        this.img1 = new Laya.Image();
        this.img1.skin = "bg/500.png";
        this.img0 = new Laya.Image();
        this.img0.skin = "bg/500_0.png";
        this.addChild(this.img1);
        this.addChild(this.img0);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDis);
    }

    static getOne():GameThorn
    {
        let one:GameThorn = Laya.Pool.getItemByClass(GameThorn.TAG,GameThorn);
        GameThorn.arr.push(one);
        return one;
    }

    static recover():void
    {
        while(GameThorn.length > 0)
        {
            let one:GameThorn = GameThorn.arr.shift();
            one.removeSelf();
            Laya.Pool.recover(GameThorn.TAG,one);
        }
    }


    private onDis():void
    {
        this.inDanger = false;
        this.img1.removeSelf();
        this.img0.removeSelf();
        this.addChild(this.img0);
        Laya.timer.frameLoop(1,this,this.onLoop);
        this.onLoop();
    }

    private onLoop():void
    {
        let now = Game.executor.getWorldNow();
        if(now > this.lastTime)
        {
            this.inDanger = !this.inDanger;
            this.lastTime = now + this.cd;
            if(this.inDanger)
            {
                this.img0.removeSelf();
                this.addChild(this.img1);
            }
            else
            {
                this.img1.removeSelf();
                this.addChild(this.img0);
            }
            // this.skin = this.inDanger ? 'bg/500.png' : 'bg/500_0.png';
        }
    }

    private onUnDis():void
    {
        this.inDanger = false;
        Laya.timer.clear(this,this.onLoop);
        this.img1.removeSelf();
        this.img0.removeSelf();
    }
}