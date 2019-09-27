import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import Session from "../../../Session";
import SysHero from "../../../sys/SysHero";
import App from "../../../../core/App";
import LvUpView from "./LvUpView";
import GameEvent from "../../../GameEvent";
import SysChapter from "../../../sys/SysChapter";
import { AD_TYPE } from "../../../../ADType";
import { GoldType } from "../../../../game/data/HomeData";
import CookieKey from "../../../../gameCookie/CookieKey";
export default class GameOverView extends ui.test.GameOverUI {
    private maskSpr: Laya.Sprite = new Laya.Sprite();
    private oldLv: number;
    private newLv: number;
    private newExp: number;
    private oldPercent: number;
    private newPercent: number;

    private delayTime:number = 200;
    constructor() {
        super();
        App.sdkManager.initAdBtn(this.fuhuoBtn.fuhuo, AD_TYPE.AD_BATTLE10);
        this.on(Laya.Event.DISPLAY, this, this.onDis);
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onRewardSuccess(): void  {
        Game.showCoinsNum = Game.showCoinsNum * 2;
        Game.showBlueNum = Game.showBlueNum * 2;
        Game.showRedNum = Game.showRedNum * 2;

        this.lanzuan.value = "+" + Game.showBlueNum;

        this.hongzuan.value = "+" + Game.showRedNum;

        this.coinClip.value = "+" + Game.showCoinsNum;
        let deltaNum: number = Math.floor(Game.showCoinsNum * Session.talentData.lineGold / 100);
        this.deltaCoin.value = "+" + deltaNum;
        this.deltaCoin.visible = deltaNum > 0;

        Session.homeData.changeGold(GoldType.GOLD,Game.showCoinsNum);
        Session.homeData.changeGold(GoldType.BLUE_DIAMONG,Game.showBlueNum);
        Session.homeData.changeGold(GoldType.RED_DIAMONG,Game.showRedNum);
        console.log("5倍奖励", Game.showCoinsNum, Game.showBlueNum, Game.showRedNum);
        Session.saveData();

        setTimeout(() => {
            this.onCloseView();
        }, 300);
    }

    private onCloseView():void
    {
        this.removeSelf();
        Game.showMain();
    }

    private onClick(e:Laya.Event): void {
        if(e.target == this.fuhuoBtn.fuhuo)
        {
            App.sdkManager.playAdVideo(AD_TYPE.AD_BATTLE10, new Laya.Handler(this, this.onRewardSuccess));
        }
        else
        {
            this.removeSelf();
            Game.showMain();
        }
    }

    private onDis(): void {
        Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
        Laya.timer.frameLoop(1,this,this.onLoop);
        Laya.MouseManager.enabled = false;
        this.oldLv = Session.homeData.playerLv;
        let sys: SysHero = App.tableManager.getDataByNameAndId(SysHero.NAME, this.oldLv);
        this.oldPercent = Session.homeData.playerExp / sys.roleExp;
        this.oldPercent = Math.min(1, this.oldPercent);
        this.lastWidth = this.expBar.width * this.oldPercent;

        this.setmask();

        let arr: number[] = SysHero.getNewLv(Game.heroExp);
        this.newLv = arr[0];
        this.newExp = arr[1];
        sys = App.tableManager.getDataByNameAndId(SysHero.NAME, this.newLv);
        this.newPercent = this.newExp / sys.roleExp;
        this.newPercent = Math.min(1, this.newPercent);

        this.bigBox.y = Laya.stage.height / 2;

        
        this.lanBox.removeSelf();
        this.ziBox.removeSelf();
        this.coinBox.removeSelf();
        this.lightView.visible = false;
        this.topBox.visible = false;
        this.expBox.visible = false;
        this.lingqu.visible = false;
        this.fuhuo.visible = false;

        this.topBox.visible = true;
        this.topBox.scale(2.5, 2.5);
        this.topBox.alpha = 0;
        Laya.Tween.to(this.topBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext));

        this.cengshu.value = this.oldLv + "";
        this.dengji.value = this.oldLv + "";
    }


    private onNext(): void {
        this.lightView.visible = true;
        this.lightView.scale(2.5, 2.5);
        this.lightView.alpha = 0;
        Laya.Tween.to(this.lightView, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext1));
    }

    private onNext1(): void  {
        this.expBox.visible = true;
        this.updateExp();
    }

    updateExp(): void {
        if (this.newLv == this.oldLv) {
            Laya.Tween.to(this.bigBox,{y:366},this.delayTime,null,new Laya.Handler(this,()=>{
                Laya.timer.frameLoop(1, this, this.onLoopExp);
            }));
        }
        else {
            Laya.timer.frameLoop(1, this, this.onLoopLv);
        }
    }

    private onLoopLv(): void {
        this.lastWidth += 5;
        if (this.lastWidth >= this.expBar.width) {
            this.lastWidth = 0;
            this.oldLv++;
            this.cengshu.value = this.oldLv + "";
            this.dengji.value = this.oldLv + "";

            Laya.timer.clear(this, this.onLoopLv);
            Laya.stage.event(GameEvent.LV_UP_VIEW);
            // if (this.oldLv >= this.newLv) {
                
            //     Laya.timer.frameLoop(1, this, this.onLoopExp);
            // }
        }

        this.setmask();
    }

    private lastWidth: number = 0;
    private onLoopExp(vv: number): void {
        this.lastWidth += 5;
        if (this.lastWidth >= this.expBar.width * this.newPercent) {
            this.lastWidth = this.expBar.width * this.newPercent;
            Laya.timer.clear(this, this.onLoopExp);

            this.hh = 800;
            this.lingqu.visible = true;
            this.lingqu.scale(2.5, 2.5);
            this.lingqu.alpha = 0;
            Laya.Tween.to(this.lingqu, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext2));
        }
        this.setmask();
    }

    private hh: number;

    private onNext2(): void  {
        if (Game.showBlueNum > 0) {
            this.addChild(this.lanBox);
            this.lanzuan.value = "+" + Game.showBlueNum;
            this.lanBox.x = 375;
            this.lanBox.y = this.hh;
            this.hh += 100;

            this.lanBox.visible = true;
            this.lanBox.scale(2.5, 2.5);
            this.lanBox.alpha = 0;
            Laya.Tween.to(this.lanBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext3));
        }
        else  {
            this.onNext3();
        }
    }

    private onNext3(): void  {
        if (Game.showRedNum > 0) {
            this.hongzuan.value = "+" + Game.showRedNum;
            this.addChild(this.ziBox);
            this.ziBox.x = 375;
            this.ziBox.y = this.hh;
            this.hh += 100;

            this.ziBox.visible = true;
            this.ziBox.scale(2.5, 2.5);
            this.ziBox.alpha = 0;
            Laya.Tween.to(this.ziBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext4));
        }
        else  {
            this.onNext4();
        }
    }

    private onNext4(): void  {
        if (Game.showCoinsNum > 0) {
            this.coinClip.value = "+" + Game.showCoinsNum;
            let deltaNum: number = Math.floor(Game.showCoinsNum * Session.talentData.lineGold / 100);
            this.deltaCoin.value = "+" + deltaNum;
            this.deltaCoin.visible = deltaNum > 0;
            this.addChild(this.coinBox);
            this.coinBox.x = 375;
            this.coinBox.y = this.hh;
            this.hh += 100;

            this.coinBox.visible = true;
            this.coinBox.scale(2.5, 2.5);
            this.coinBox.alpha = 0;
            Laya.Tween.to(this.coinBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext5));
        }
        else  {
            this.onNext5();
        }
    }

    private onNext5(): void  {
        this.fuhuo.y = this.hh - 30;
        this.fuhuo.visible = true;
        this.fuhuo.scale(2.5, 2.5);
        this.fuhuo.alpha = 0;
        Laya.Tween.to(this.fuhuo, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext6));
    }

    private onNext6(): void  {
        Session.homeData.addPlayerExp(Game.heroExp);
        Session.saveData();
        Laya.MouseManager.enabled = true;
    }

    private setmask(): void  {
        this.lastWidth = Math.max(1, this.lastWidth);
        this.maskSpr.graphics.clear();
        this.maskSpr.graphics.drawRect(0, 0, this.lastWidth, this.expBar.height, "#fff000");
        this.expBar.mask = this.maskSpr;
    }

    private onLoop(): void {
        this.lightView.rotation++;
    }

    removeSelf(): Laya.Node {
        Laya.timer.clear(this, this.onLoop);
        Game.state = 0;
        return super.removeSelf();
    }
}