import { ui } from "../../../../ui/layaMaxUI";
import GameBG from "../../../../game/GameBG";
import Game from "../../../../game/Game";
import GameEvent from "./../../../GameEvent";
import SysChapter from "../../../sys/SysChapter";
import App from "../../../../core/App";
import Session from "../../../Session";
import SysMap from "../../../sys/SysMap";
import GameCameraNum from "../../../../game/GameCameraNum";
import WorldCell from "./WorldCell";
import TimeGoldDialog from "../timegold/TimeGoldDialog";
import GameMain from "../../../GameMain";
import MyTimeGold from "../timegold/MyTimeGold";
import FlyEffect from "../../../../game/effect/FlyEffect";
import FlyUpTips from "../../../FlyUpTips";
import GuideManager, { Guide_Type } from "../../../guide/GuideManager";
import OpenIconDialog from "../../../guide/OpenIconDialog";
    export default class WorldView extends ui.test.worldUI {
    private list:Laya.List;
    constructor() { 
        super();
        //this.box.y = this.box.y + App.top;
        this.box1.y = this.box1.y + App.top;

        this.box1.mouseThrough = true;

        this.list = new Laya.List();
        this.list.pos(this.box.x,this.box.y);
        this.addChild(this.list);
        this.list.itemRender = WorldCell;
        this.list.size( Laya.stage.width , this.box.height );
        // this.list.repeatX = 1;
        // this.list.repeatY = 2;
        this.list.vScrollBarSkin = "";
        // this.list.selectEnable = true;
        this.list.renderHandler = new Laya.Handler(this, this.updateItem);

        this.on(Laya.Event.DISPLAY,this,this.onDis);

        let myTime = new MyTimeGold();
        myTime.setUI( this.timeLogo );
        this.timeLogo.on( Laya.Event.CLICK , this,this.timeClickFun );
        this.rankBtn.on( Laya.Event.CLICK,this,this.rankClickFun );
        this.sign7Btn.on( Laya.Event.CLICK,this,this.sign7clickFun );
        this.shareBtn.on( Laya.Event.CLICK,this,this.shareFun );
        this.frogBtn.on(Laya.Event.CLICK,this,this.gotoFrog);
        //Laya.timer.once( 1000,this,this.tttFun );
        Laya.stage.on( GameEvent.ADD_COIN , this , this.addCoinFun );
        Laya.stage.on( GameEvent.APP_ENERGY ,  this, this.reducePowerFun );
        //Laya.stage.on( Laya.Event.CLICK ,this,this.reducePowerFun , [1] );

        this.addChild(this.box1);

        Laya.stage.on( GameEvent.SHOW_MAIN , this, this.showMain );
    }

    private gotoFrog():void
    {
        if (Laya.Browser.window.wx) {
            Laya.Browser.window.wx.navigateToMiniProgram({
                appId: 'wx63d79f4642c0f508',
                path: '',
                envVersion: "release",
                success(res) {
                  console.log("按钮跳转小游戏成功");
                }
              });
        }
    }

    public showMain():void{
        Laya.timer.once( 600 ,  null , ()=>{
            if( Session.homeData.newStat == Guide_Type.click_talent ){
                let dp = new OpenIconDialog( 2 );
                dp.popup( false, false );
            }else if( Session.homeData.newStat == Guide_Type.open_role ){
                let dp = new OpenIconDialog( 1 );
                dp.popup( false, false );
            }
        } );
    }

    public reducePowerFun( v:number ):void{
        let r = new ui.test.ReducePowerUI();
        this.addChild( r ); 
        r.fc.value = "-" + v;
        let sp:Laya.Sprite = WorldCell.clickCell.mapBtn;
        let p = sp.localToGlobal( new Laya.Point( 0 ,0 ) , true, this );
        r.x = p.x + sp.width/2;
        r.y = p.y + sp.height/2;
        let t = new Laya.Tween();
        t.to( r , { y:r.y - 200 } , 700 , null , new Laya.Handler(this,this.rFun, [r] ));
    }

    private rFun(  a:Laya.Sprite ):void{
        a.removeSelf();
    }

    private shareFun():void{
        App.sdkManager.onlyShare();
    }

    private sign7clickFun():void{
        FlyUpTips.setTips("敬请期待");
    }

    private addCoinFun( v:number ):void {
        let last = Session.homeData.coins - v;
        let fc = Game.scenneM.main.mainUI.topUI.coinClip;
        fc.value = last + "";
        let cell = this.list.getCell(0);
        let fly = new FlyEffect();
        //fly.fly( this.list.getCell(0) , Game.scenneM.main.coinClip );
        fly.flyFromP( Laya.stage.width/2, Laya.stage.height/2 , Game.scenneM.main.mainUI.topUI.goldImg , v , last , fc );
    }

    private rankClickFun():void{
        App.dialogManager.open( GameMain.RANK_DIALOG );
    }

    private timeClickFun():void{
        App.dialogManager.open( GameMain.TIME_GOLD );
    }

    private updateItem(cell: WorldCell, index: number): void  {
        let sysChapter:SysChapter = this.list.getItem(index);

        if(  sysChapter && sysChapter.id == Session.homeData.openId ){
            cell.update( sysChapter , true );
            cell.open();
        }else{
            cell.update( sysChapter );
        }
    }

    private onDis():void{

        let indexTo:number = Session.homeData.chapterId - 1;
        indexTo = Math.max( indexTo , 0 );

        let arr:SysChapter[] = App.tableManager.getTable(SysChapter.NAME);
        let arr1 = arr.concat();
        arr1.length = 3;
        arr1.push( null );
        this.list.array = arr1;
        this.list.scrollTo( indexTo );
        
        let cell:ui.test.worldCellUI = <any>this.list.getCell( indexTo );
        cell.mapBtn.scale( 0.0,0.0 );
        let t = new Laya.Tween();
        t.to( cell.mapBtn , {scaleX:1,scaleY:1} , 500 , Laya.Ease.backOut , null , 200 );

        Session.homeData.openId = -1;
    }
}