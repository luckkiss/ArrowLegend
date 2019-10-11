import { ui } from "./../../../../ui/layaMaxUI";
import Session from "../../../Session";
import Game from "../../../../game/Game";
import SysChapter from "../../../sys/SysChapter";
import SysHero from "../../../sys/SysHero";
import App from "../../../../core/App";
import { GoldType } from "../../../../game/data/HomeData";
import GameEvent from "../../../GameEvent";
export default class LvUpView extends ui.test.shengjiUI {

    private delayTime:number = 200;
    constructor() {
        super();
        this.on(Laya.Event.DISPLAY, this, this.onDis);
        // this.rebornBtn.clickHandler = new Laya.Handler(this, this.onCloseView);
        this.on(Laya.Event.CLICK,this,this.onCloseView);
    }

    private onCloseView(): void {
        this.removeSelf();
        Laya.timer.clear(this, this.onLoop);
        App.sendEvent(GameEvent.LV_UP_VIEW_2);
    }

    private hh:number;
    private sysHero:SysHero;
    private onDis(): void {
        Laya.MouseManager.enabled = false;
        let newLv:number = Session.homeData.playerLv;

        this.lvClip.value = "" + newLv;
        this.lvLabel.text = "" + newLv;

        this.sysHero = App.tableManager.getDataByNameAndId(SysHero.NAME,newLv);

        Session.homeData.changeGold(GoldType.GOLD,this.sysHero.gold);
        Session.homeData.changeGold(GoldType.BLUE_DIAMONG,this.sysHero.blueDiamond);
        Session.homeData.changeGold( GoldType.RED_DIAMONG,this.sysHero.redDiamond);



        Laya.timer.frameLoop(1, this, this.onLoop);
        this.dunpaiBox.visible = false;
        this.lvBox.visible = false;
        this.lingqu.visible = false;
        this.lanBox.visible = false;
        this.ziBox.visible = false;
        this.coinBox.visible = false;
        this.rebornBtn.visible = false;

        this.hh = 800;

        this.dunpaiBox.visible = true;
        this.dunpaiBox.scale(2.5, 2.5);
        this.dunpaiBox.alpha = 0;
        Laya.Tween.to(this.dunpaiBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext));
        
    }

    private onNext():void
    {
        this.lvBox.visible = true;
        this.lvBox.scale(2.5, 2.5);
        this.lvBox.alpha = 0;
        Laya.Tween.to(this.lvBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext1));
    }

    private onNext1():void
    {
        this.lingqu.visible = true;
        this.lingqu.scale(2.5, 2.5);
        this.lingqu.alpha = 0;
        Laya.Tween.to(this.lingqu, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext2));
    }

    private onNext2():void
    {
        if (this.sysHero.blueDiamond > 0) {
            this.lanzuan.value = "+" + this.sysHero.blueDiamond;
            this.addChild(this.lanBox);
            this.lanBox.x = 353;
            this.lanBox.y = this.hh;
            this.hh += 100;

            this.lanBox.visible = true;
            this.lanBox.scale(2.5, 2.5);
            this.lanBox.alpha = 0;
            Laya.Tween.to(this.lanBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext3));
        }
        else
        {
            this.onNext3();
        }
    }

    private onNext3():void
    {
        if (this.sysHero.redDiamond > 0) {
            this.hongzuan.value = "+" + this.sysHero.redDiamond;
            this.addChild(this.ziBox);
            this.ziBox.x = 353;
            this.ziBox.y = this.hh;
            this.hh += 100;

            this.ziBox.visible = true;
            this.ziBox.scale(2.5, 2.5);
            this.ziBox.alpha = 0;
            Laya.Tween.to(this.ziBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext4));
        }
        else
        {
            this.onNext3();
        }
    }

    private onNext4():void
    {
        if (this.sysHero.gold > 0) {
            this.coinClip.value = "+" + this.sysHero.gold;
            this.deltaCoin.visible = false;
            this.addChild(this.coinBox);
            this.coinBox.x = 353;
            this.coinBox.y = this.hh;
            this.hh += 100;

            this.coinBox.visible = true;
            this.coinBox.scale(2.5, 2.5);
            this.coinBox.alpha = 0;
            Laya.Tween.to(this.coinBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext5));
        }
        else
        {
            this.onNext5();
        }
    }

    private onNext5():void
    {
        this.rebornBtn.y = this.hh + 30;
        this.rebornBtn.visible = true;
        this.rebornBtn.scale(2.5, 2.5);
        this.rebornBtn.alpha = 0;
        Laya.Tween.to(this.rebornBtn, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext6));
    }

    private onNext6():void
    {
        Laya.MouseManager.enabled = true;
    }

    private onLoop(): void {
        this.lightView.rotation++;
    }
}
