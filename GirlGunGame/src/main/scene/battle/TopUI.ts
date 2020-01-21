import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
import SysLevel from "../../sys/SysLevel";
import DisplayUtils, { MaskObj } from "../../../core/utils/DisplayUtils";
import App from "../../../core/App";
import SysMap from "../../sys/SysMap";
import Session from "../../Session";
import GameEvent from "../../GameEvent";
import SysEnemy from "../../sys/SysEnemy";
    export default class TopUI extends ui.test.battleUI {
    
    private maskSpr:Laya.Sprite = new Laya.Sprite();
    _indexBox:IndexBox = new IndexBox();
    constructor() { 
        super();
        Laya.stage.on(Game.Event_COINS,this,this.updateCoins);
        Laya.stage.on(Game.Event_EXP,this,this.updateExp);

        this.indexBox.addChild(this._indexBox);

        this.y = App.top + 60;

        Laya.stage.on(GameEvent.BOOS_BLOOD_UPDATE,this,this.onUpdate);

        this.btnRecord.visible = false;
        this.btnRecord.clickHandler = new Laya.Handler(this,this.onStopRecord);
    }

    private onStopRecord():void
    {
        App.sdkManager.stopRecorder(new Laya.Handler(this,this.addPower));
    }

    private addPower():void
    {
        Session.homeData.curEnergy++;
        if(Session.homeData.curEnergy >= Session.homeData.maxEngergy)
        {
            Session.homeData.curEnergy = Session.homeData.maxEngergy;
        }
        Session.homeData.lastTime = 0;
        Session.saveData();
        this.reducePowerFun();
        this.btnRecord.visible = false;
    }

    public reducePowerFun():void{
        let r = new ui.test.ReducePowerUI();
        this.addChild( r ); 
        r.fc.value = "+1";
        r.x = 375;
        r.y = 1100;
        let t = new Laya.Tween();
        t.to( r , { y:r.y - 200 } , 700 , null , new Laya.Handler(this,this.rFun, [r] ));
    }

    private rFun(  a:Laya.Sprite ):void{
        a.removeSelf();
    }

    private onUpdate(hurt:number):void
    {
        this._curBlood -= hurt;
        this._curBlood = Math.max(1,this._curBlood);
        this.bossxue.scrollRect = new Laya.Rectangle(0,0,this.bossxue.width * this._curBlood / this._bossEnemy.enemyHp,this.bossxue.height);
    }

    private _bossEnemy:SysEnemy;
    private _curBlood:number;
    setBoss(isBoss:boolean,sys:SysEnemy):void
    {
        this.boss.visible = isBoss;
        this.bossxuetiao.visible = isBoss;
        this._bossEnemy = sys;
        if(!this._bossEnemy)
        {
            return;
        }
        this._curBlood = this._bossEnemy.enemyHp;
        if(this.bossxuetiao.visible)
        {
            this.bossxue.scrollRect = new Laya.Rectangle(0,0,this.bossxue.width,this.bossxue.height);
        }
    }

    reset():void
    {
        this._indexBox.init();
    }

    updateIndex(index:number):void
    {
        this._indexBox.update(index);
    }

    private lastWidth:number = 0;
    private isTwo:boolean = false;
    updateExp():void
    {
        let lv:number = SysLevel.getLv(Game.battleExp);
        let maxExp: number = SysLevel.getMaxExpByLv(lv);
        let curExpSum: number = SysLevel.getExpSum(lv - 1);
        let curExp: number = Game.battleExp - curExpSum;
        let vv = curExp / maxExp;

        this.isTwo = lv > Game.level;
        Laya.timer.frameLoop(1,this,this.onLoop,[vv]);

        Game.level = lv;
        if(!this.isTwo)
        {
            // this.shuzi.text = "" + Game.hero.playerData.level;
        }
        

        // let ww:number = this.lvBar.width * curExp / maxExp;
        // ww = Math.max(ww,1);
        // this.lastWidth = ww;
        
    }

    private onLoop(vv:number):void
    {
        this.lastWidth += 15;
        if(this.isTwo)
        {
            if(this.lastWidth >= this.lvBar.height)
            {
                this.lastWidth = 0;
                this.isTwo = false;
                // this.shuzi.text = "" + Game.hero.playerData.level;
            }
        }
        else
        {
            if(this.lastWidth >= this.lvBar.height * vv)
            {
                this.lastWidth = this.lvBar.height * vv;
                Laya.timer.clear(this,this.onLoop);
            }
        }
        this.lastWidth = Math.max(1,this.lastWidth);
        // this.lvBar.scrollRect = new Laya.Rectangle(0,this.lvBar.height,this.lvBar.width,-this.lastWidth);

        this.maskSpr.graphics.clear();
        this.maskSpr.graphics.drawRect(0,this.lvBar.height - this.lastWidth,this.lvBar.width,this.lastWidth,"#fff000");
        this.lvBar.mask = this.maskSpr;
    }

    updateCoins():void
    {
        this.jinbishu.value = "" + Game.showCoinsNum;
    }

    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}


export class IndexBox extends ui.game.battleIndexBoxUI
{
    private _cellList:IndexCell[] = [];
    
    constructor()
    {
        super();
        this.scrollRect = new Laya.Rectangle(0,0,this.width,this.height);
    }

    init():void
    {
        this._cellList.length = 0;
        if(Game.battleLoader.chapterId == 0)
        {
            return;
        }
        let max:number = SysMap.getTotal(Game.battleLoader.chapterId);
        for(let i = 0; i < max; i++)
        {
            let cell:IndexCell = Laya.Pool.getItemByClass(IndexCell.TAG,IndexCell);
            cell.update(i + 1);
            this.box.addChild(cell);
            cell.x = 185 + i * 150;
            cell.y = 55;
            cell.gray = true;
            this._cellList.push(cell);
            cell.visible = false;
        }
    }

    private _isInit:boolean = false;
    update(index:number):void
    {
        if(Game.battleLoader.chapterId == 0)
        {
            return;
        }
        for(let i = 0; i < this._cellList.length; i++)
        {
            this._cellList[i].visible = false;
            if(index >= 2)
            {
                if(i == index - 1 || i == index - 2 || i == index)
                {
                    this._cellList[i].visible = true;
                }
            }
            else
            {
                this._cellList[0].visible = true;
                this._cellList[1].visible = true;
                this._cellList[2].visible = true;
            }

        }
        
        let max:number = SysMap.getTotal(Game.battleLoader.chapterId);
        if(index > max)
        {
            index = max;
        }
        this.pbox1.visible = index != 1;
        this.pbox2.visible = index != max;
        if(!this._isInit)
        {
            this.box.x = -(index - 1) * 150;
            this._cellList[index - 1].scale(1.5,1.5);
            this._cellList[index - 1].gray = false;
            this._isInit = true;
            for(let i = 0; i < index - 1; i++)
            {
                this._cellList[i].gray = false;
            }
            return;
        }
        Laya.Tween.to(this.box,{x:- (index - 1) * 150},300,null,null,100);

        if(index == 1)
        {
            Laya.Tween.to(this._cellList[index - 1],{scaleX:1.5,scaleY:1.5},300,null,null,100);
        }
        else
        {
            Laya.Tween.to(this._cellList[index - 2],{scaleX:1,scaleY:1},300,null,null,100);
            Laya.Tween.to(this._cellList[index - 1],{scaleX:1.5,scaleY:1.5},300,null,null,100);
        }
        this._cellList[index - 1].gray = false;
    }
}

export class IndexCell extends ui.test.battleLvUIUI
{
    static TAG:string = "IndexCell";
    constructor()
    {
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUndis);
    }

    private onUndis():void
    {
        Laya.Pool.recover(IndexCell.TAG,this);
    }

    set gray(value:boolean)
    {
        this.btn.gray = value;
    }


    update(index:number):void
    {
        this.shuziyou.text = "" + index;
    }

}