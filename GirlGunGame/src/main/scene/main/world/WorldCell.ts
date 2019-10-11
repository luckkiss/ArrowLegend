import { ui } from "../../../../ui/layaMaxUI";
import SysChapter from "../../../sys/SysChapter";
import GameEvent from "../../../GameEvent";
import Game from "../../../../game/Game";
import Session from "../../../Session";
import FlyUpTips from "../../../FlyUpTips";
import SysMap from "../../../sys/SysMap";
import Hero from "../../../../game/player/Hero";
import MyEffect from "../../../../core/utils/MyEffect";
import App from "../../../../core/App";
import LogType from "../../../../core/manager/LogType";

export default class WorldCell extends ui.test.worldCellUI {
    private sys:SysChapter;
    constructor() { 
        super();
        this.clickBox.on(Laya.Event.CLICK,this,this.onClick);
        this.suo.visible = false;
        WorldCell.clickCell = this;
    }

    public static clickCell:WorldCell = null;

    private onClick():void
    {
        WorldCell.clickCell = this;
        if(!this.suo.visible)
        {
            Game.battleLoader.chapterId = this.sys.id;
            SysChapter.randomDiamond(Game.battleLoader.chapterId);
            Game.battleCoins = 0;
            Game.battleExp = Game.heroExp = 0;
            Hero.udpateHeroData();
            
            MyEffect.scaleEffect( this.mapBtn );
            Laya.stage.event(GameEvent.START_BATTLE);

            App.sdkManager.log(LogType.CHAPTER_INDEX,this.sys.id+"");
        }
        else
        {
            FlyUpTips.setTips("未开启");
        }
    }

    public sys1:SysChapter = null;

    public update(sysChapter:SysChapter , force:boolean = false ):void
    {
        this.sys1 = sysChapter;
        
        if( sysChapter == null ){
            this.openBox.visible = false;
            this.noOpenImg.visible = true;
            this.titleTxt.skin = "chapters/wait_title.png";
            return;
        }else{
            this.openBox.visible = true;
            this.noOpenImg.visible = false;
        }

        this.sys = sysChapter;
        this.suo.visible = Session.homeData.chapterId < sysChapter.id;
        if( force ){
            this.suo.visible = false;
        }
        this.mapBtn.gray = this.suo.visible;
        this.cengshuTxt.text = "";
        this.titleTxt.skin = "chapters/chapter_title_" + this.sys.id + ".png";
        this.mapBtn.skin = "chapters/chapter_img_" + this.sys.id + ".png";
        this.box1.visible = !this.suo.visible;
        if(!this.suo.visible) {
            let maxCeng:number =  SysMap.getTotal(this.sys.id);
            if( sysChapter.id == Session.homeData.chapterId ) {
                this.cengshuTxt.text = "最高层数:" + Session.homeData.mapIndex + "/" + maxCeng;
            } else {
                this.cengshuTxt.text = "最高层数:" + maxCeng + "/" + maxCeng;
            }
        }
    }

    public open():void{
        let t = new Laya.Tween();
        t.to( this.suo , { scaleX : 5,  scaleY :5 ,alpha :0 } ,  600 , null , new Laya.Handler(this,this.comfun) );
    }

    public comfun():void{
        this.update( this.sys1 );
    }
}